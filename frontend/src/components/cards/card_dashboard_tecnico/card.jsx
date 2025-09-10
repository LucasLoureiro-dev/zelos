import Image from "next/image";
import Link from "next/link";

export default function Card_dashboard_tecnico({ nome, subtitulo, numero_chamadas}) {
    return (
        <>
            <div className="card shadow border border-0" >
                <div className="card-body">
                    <h4>Conectado como:</h4>
                    <h3 className="card-title">{nome}</h3>
                    <h6 className="card-subtitle mb-2 text-body-secondary">Cargo: tecnico</h6>
                </div>
            </div>

        </>
    );
}