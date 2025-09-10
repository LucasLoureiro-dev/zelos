"use client"
import "@/app/agendamento/usuario/agendamento.css";
import React, { useRef, useEffect } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


const FullCalendar = () => {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'pt-br',
      timeZone: 'America/Sao_Paulo',
      buttonText: {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia', 
        list: 'Lista'
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
      },
      aspectRatio: 1.35,
    });

    calendar.render();
  }, []);

  return (
    <div className='height-fc' ref={calendarRef}></div>
  );
};

export default FullCalendar;