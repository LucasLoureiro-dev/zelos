"use client"

import Chart from "react-google-charts";
import { useTheme } from '../../../app/contexts/ThemeContext'

export default function Card_dashboard_grafico({ numero_pendente = 0, numero_emAndamento = 0, numero_concluida = 0 }) {
    const { isDarkMode } = useTheme();


    const data = [
        ["Chamadas", "status das chamadas"],
        ["Pendente", numero_pendente],
        ["Em andamento", numero_emAndamento],
        ["Concluida", numero_concluida],
    ];

    console.log(data)
    const lightOptions = {
        backgroundColor: 'transparent',
        legend: { textStyle: { color: '#233238', fontSize: 14 } },
        pieSliceTextStyle: { color: 'black', fontSize: 14 },
        colors: ["#4d4dff", "#ffc107", "#28a745"],
    };


    const darkOptions = {
        backgroundColor: '#212529',
        legend: { textStyle: { color: '#FFFFFF', fontSize: 14 } },
        pieSliceTextStyle: { color: 'white', fontSize: 14 },
        colors: ["#4d4dff", "#ffc107", "#28a745"],
    };

    const chartOptions = isDarkMode ? darkOptions : lightOptions;

    return (
        <div className="estatisticas card shadow border border-0" style={{ width: "100%", backgroundColor: isDarkMode ? '#2E3134' : '#FFF' }}>
            <div className="card-body">
                <h5 className="card-title" style={{ color: isDarkMode ? '#FFF' : '#000' }}>Veja as estatisticas de suas chamadas</h5>
                <p className="card-subtitle mb-2" style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>Veja quantas chamadas estão em andamento, concluidas ou pendentes</p>
                <div className="card-text">
                    {numero_pendente != null || numero_emAndamento != null || numero_concluida != null ? (
                        <Chart
                            chartType="PieChart"
                            data={data}
                            options={chartOptions}
                            width={"100%"}
                            height={"300px"}
                        />
                    ) : (
                        <>
                            <h4 className="text-center mt-3 texto-muted">Não há chamados!</h4>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}