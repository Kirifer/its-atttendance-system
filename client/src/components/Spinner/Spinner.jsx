import { ClipLoader } from "react-spinners";

function Spinner({ size = 40 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <ClipLoader size={size} />
    </div>
  );
}

export default Spinner;
