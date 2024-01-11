import { useContext, useState } from 'react';
import { GlobalContext } from '../context/globalContext';
import { Loading } from '../components/utils/Loading';
import { timeToMilliseconds } from '../utils/utils';
import { usePostFechaResult } from '../hooks/useFecha';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ResultForm() {
  const { globalData, playersData } = useContext(GlobalContext);
  const [carValue, setCarValue] = useState(undefined);
  const { httpCall: sendResult, isLoading: isSendingLoading } = usePostFechaResult();

  const onPlayerChange = (e: any) => {
    const value = e.target.value;
    const car = playersData.find((el) => el.slack == value)?.car;
    setCarValue(car);
  };

  function handleSubmit(e) {
    e.preventDefault();
    const fields = new FormData(e.target);
    fields.append('car', carValue);
    // basic validation
    const { car, time, player } = Object.fromEntries(fields);

    if (!car || !time || !player) {
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Completá todos los campos.',
      });
      return;
    }

    try {
      const [min, sec, ms] = time
        .toString()
        .split(/[.,:\s]/)
        .map((el) => parseInt(el));

      if ([min, sec, ms].some((n) => n == undefined)) {
        throw new Error('Bad format');
      }

      const totalMs = timeToMilliseconds(min, sec, ms);
      fields.set('time', totalMs);
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Formato de tiempo incorrecto. Usá MM:ss:mmm\nTambién se pueden usar puntos. ',
      });
      return;
    }

    fields.append('fecha', `Fecha${globalData?.FechaActual}`);
    fields.append('timestamp', Date.now().toString());

    MySwal.fire({
      title: 'Enviando resultados ...',
      didOpen: () => {
        MySwal.showLoading();
        sendResult({ body: fields }).then(() => {
          MySwal.fire({
            title: 'Listo',
            icon: 'success',
            text: 'Tus resultados fueron guardados exitosamente. ',
          });
        });
      },
    });
  }

  return (
    <div style={{ width: 'min(800px, 100%)', margin: 'auto' }}>
      <h1 className="text-center">Carga de tiempos para fecha {globalData?.FechaActual}.</h1>

      <form className="d-flex flex-col" style={{ gap: '10px', marginTop: '40px' }} onSubmit={handleSubmit}>
        <select name="player" onChange={onPlayerChange}>
          <option value="">Jugador</option>
          {playersData?.map((player) => (
            <option key={player.slack} value={player.slack}>
              {player.lastname}, {player.name} - @{player.slack}
            </option>
          ))}
        </select>
        <input name="car" disabled required placeholder="Vehículo" className="result-input" value={carValue || ''} />
        <input name="time" type="text" placeholder="MM:SS:mmm" className="result-input" />

        <div className="text-center">
          <button type="submit" className="w-50">
            Cargar tiempo
          </button>
        </div>
      </form>
    </div>
  );
}

export function AddResult() {
  const { isGlobalContextLoading } = useContext(GlobalContext);

  return (
    <div className="w-100">
      {isGlobalContextLoading ? <Loading style={{ height: '350px', marginTop: '25vh' }} /> : <ResultForm />}
    </div>
  );
}
