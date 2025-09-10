import Image from "next/image";
import Link from "next/link";

export default function Card_dashboard_usuario({nome, cargo, numero_chamadas}) {
    return (
        <>
            <div className="border border-1 shadow p-4 rounded-2 chart-1">
                <div className="card-body">
                    <h4>Bem-vindo: {nome}</h4>
                    <h6 className="card-subtitle mb-2 text-body-secondary">cargo: {cargo}</h6>
                    <div className="card-text">
                        <p>numero de chamadas feitas: {numero_chamadas}</p>
                    </div>
                </div>
            </div>

        </>
    );
}