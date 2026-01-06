import Spinner from "./Spinner";
function Loader({ loading, children }) {
  if (loading) return <Spinner />;
  return children;
}

export default Loader;