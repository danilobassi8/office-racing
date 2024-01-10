import { userService } from '../services/userService';

export function OfficeRacing() {
  const sendData = () => {
    const getFormData = (object: any) =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);
        return formData;
      }, new FormData());

    const body = getFormData({ timestamp: Date.now(), user: 'fasd', time: '3:00:00' });

    userService.sendTime('Fecha1', body).then((r) => console.log('LISTO, r:', r));
  };

  const getData = () => {
    userService.getTabData('Fecha1').then((res) => {
      console.log({ res });
    });
  };

  return (
    <>
      <button onClick={sendData}>Send data</button>
      <button onClick={getData}>GET data</button>
    </>
  );
}
