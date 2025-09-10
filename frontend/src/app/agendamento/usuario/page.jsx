import "@/app/agendamento/usuario/agendamento.css";
import SideBar from "@/components/sideBar/sidebar";
import { Poppins } from "next/font/google";
import FullCalendar from "@/components/calendario/calendario";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export default function Agendamento() {
  return (
    <>
      <div className="container-fluid p-0 m-0">
        <div className="d-flex flex-row me-0">
          <div className="col-md-3">
           <SideBar /> </div>
         
        <div className=" w-100">
        <div className="fundo-paginas d-flex flex-column row-gap-4 p-4">
          <h2 className={`${poppins.className} fw-bold`}>Agendamento</h2>
          <button className="btn-ad-agendamento bg-transparent p-2 gap-2  border-2 d-flex  align-items-center" style={{ width: "18rem" }}>
            <i className="fa-solid fa-plus"></i>
            <p className={`m-0 ${poppins.className}`}>
              Adicionar Agendamento
            </p>
          </button>

          <button className="d-flex p-2 gap-2 bg-transparent btn-ad-agendamento align-items-center" style={{ width: "18rem" }}>
            <i className="fa-solid fa-filter"></i>
            <p className={`m-0 ${poppins.className}`}>
              Filtrar Agendamentos
            </p>
          </button> 
                  
            <div className="h-100 bg-white text-black p-2"> 
                    <FullCalendar />
            </div>

        </div>
        </div>
      </div>
      </div>
    </>
  );
}
