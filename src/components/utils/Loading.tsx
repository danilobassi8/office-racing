import { LoadingIcon } from '../../icons/LoadingIcon';

export function Loading({ style = {} }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <div>
        <LoadingIcon
          style={{ animation: 'loadingRotation 1s infinite', height: '350px', marginTop: '25vh', ...style }}
        />
      </div>
    </div>
  );
}
