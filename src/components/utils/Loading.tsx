import { LoadingIcon } from '../../icons/LoadingIcon';

export function Loading({ style = {} }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <div>
        <LoadingIcon style={{ ...style, animation: 'loadingRotation 1s infinite' }} />
      </div>
    </div>
  );
}
