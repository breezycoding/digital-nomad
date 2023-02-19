import { useState, ChangeEvent, FC, SyntheticEvent, useEffect } from "react";
import Calendar from "react-calendar";
// @ts-ignore
import FileBase64 from "react-file-base64";
import { debounce } from "lodash";
// @ts-ignore
import CryptoJS from "crypto-js";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateFormData,
  updateCorporateDate,
  updateFile,
  selectFormData,
  IFormData,
} from "../../src/features/formSlice";

import "react-calendar/dist/Calendar.css";
import styles from "../styles/Home.module.css";

const secretPass = "XkhZG4fW2t2W";

const Home: FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);

  const [corporateDate, setCorporateDate] = useState<Date>(new Date());

  useEffect(() => {
    if (corporateDate) {
      dispatch(updateCorporateDate(corporateDate.toString()));
    }
  }, [corporateDate, dispatch]);

  const encryptData = (formData: IFormData): string => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      secretPass
    ).toString();

    return data;
  };

  const decryptData = (encryptedData: string): IFormData => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretPass);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ): void => {
    const dataCopy = { ...formData };
    Object.assign(dataCopy, { ...dataCopy, [field]: event.target.value });
    dispatch(updateFormData({ ...dataCopy }));
  };

  const debounceFormInput = debounce(
    (event: ChangeEvent<HTMLInputElement>, field: string) => {
      handleChange(event, field);
    },
    500
  );

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log("encrypted data: ", encryptData(formData));
    console.log("decrypted data: ", decryptData(encryptData(formData)));
  };

  const myFiles = (file: any) => {
    dispatch(updateFile(file.base64));
  };

  return (
    <div className={styles.main}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <div>
              <label htmlFor="company-name">Company Name:</label>
              <input
                type="text"
                onChange={(event) => debounceFormInput(event, "companyName")}
              />
            </div>
            <div>
              <label htmlFor="company-name">Corporation Date:</label>
              <Calendar onChange={setCorporateDate} value={corporateDate} />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div>
              <label htmlFor="street">Street:</label>
              <input
                type="text"
                onChange={(event) => debounceFormInput(event, "street")}
              />
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <input
                type="text"
                onChange={(event) => debounceFormInput(event, "city")}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div>
              <label htmlFor="state">State:</label>
              <input
                type="text"
                onChange={(event) => debounceFormInput(event, "state")}
              />
            </div>
            <div>
              <label htmlFor="state">Zip Code:</label>
              <input
                type="number"
                onChange={(event) => debounceFormInput(event, "zipcode")}
              />
            </div>
          </div>
          <div className={styles.inputContainerFile}>
            <label htmlFor="state" style={{ display: "block" }}>
              Upload Document:
            </label>
            <FileBase64 multiple={false} onDone={myFiles} />
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
