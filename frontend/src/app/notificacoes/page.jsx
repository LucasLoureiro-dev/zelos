
import "../notificacoes/notificacoes.css";
// import useUsuario from "@/utils/hook/useUsuario";
import SideBar from "@/components/sideBar/sidebar";
import Chat_bot from "@/components/bot/ChatBot";

export default function Notificacoes() {


  function handleVisto(id) {
    let achou
    if (visto) {
      achou = visto.find((item) => item.notificacao == id)
    }

    if (achou) {
      return "tabela-tecnico"
    }
    else {
      return "tabela-tecnico-visto"
    }
  }
  
  return (
    <>
      <div className="container-fluid p-0 m-0 d-flex flex-column flex-sm-row notificacoes min-vh-100">
        <SideBar />
        <div className="d-flex flex-row me-0 main">

          <div className="d-flex flex-column w-100 row-gap-3">
            <div className="d-flex flex-column p-4 w-100 w-md-75">
              <h4 className="mb-4">Notificações</h4>
              <div className="tabela-container p-3">
                <table className="tabela-notificacoes w-100">
                  <thead className="">
                    <tr>
                      <th className="col p-3">Título</th>
                      <th className="col p-3">Descrição</th>
                      <th className="col p-3">Data</th>
                      <th className="col p-3">Status</th>
                      <th className="col p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-th="titulo" className="p-2">titulo</td>
                      <td data-th="desc" className="p-2">desc</td>
                      <td data-th="data" className="p-2">xx/xx/xxxx</td>
                      <td data-th="status" className="p-2">status</td>
                      <td data-th="ação" className="p-2">
                        <p className="bg-success p-1 w-100 m-0">aceitar</p>
                      </td>
                    </tr>
                    <tr>
                      <td data-th="titulo" className="p-2">titulo</td>
                      <td data-th="desc" className="p-2">desc</td>
                      <td data-th="data" className="p-2">xx/xx/xxxx</td>
                      <td data-th="status" className="p-2">status</td>
                      <td data-th="ação" className="p-2">
                        <p className="bg-success p-1 w-100 m-0">aceitar</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-success div-teste">
                <p>olalaoa</p>
              </div>
            </div>
          </div>
        </div>
        <Chat_bot />
      </div>

      
    </>
  );
}
