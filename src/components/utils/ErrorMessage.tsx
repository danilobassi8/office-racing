export function ErrorMessage({ errorMessage, children = undefined }) {
  return (
    <div className="w-100 d-flex align-center flex-col">
      <h1>Error: </h1>
      <h4 style={{ marginTop: '20px' }}>{errorMessage}</h4>
      {children}
    </div>
  );
}
