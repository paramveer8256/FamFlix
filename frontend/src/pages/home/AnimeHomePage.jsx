import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const AnimeHomePage = () => {
  const navigate = useNavigate();
  const handleToggle = (e) => {
    if (e.target.checked) {
      navigate("/");
    } 
    // else {
    //   navigate("/home");
    // }
  };
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <label class="switch">
        <input type="checkbox" onChange={handleToggle} />
        <span class="slider round"></span>
      </label>
    </div>
  );
};

export default AnimeHomePage;
