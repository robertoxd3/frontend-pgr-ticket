function printRequisitos() {
            var nombre="prueba";
            var requisitos="requisitos";
            var contenidoTicket = "<table style='width: 100%; border-collapse: collapse; border-style: double; height: 605px;' border='1'><tbody><tr style='height: 238px;'><td style='width: 100%; height: 238px;'><h4 style='text-align: center;'><img style='display: block; margin-left: auto; margin-right: auto;' src='http://www.pgr.gob.sv/images/logo-pgr-marzo-2021.png' alt='LOGO' width='133' height='145' /><strong>REQUISITOS MINIMOS PARA EL TIPO DE CASO:</strong></h4><h3 style='text-align: center;'>" + nombre + "</h3></td></tr><tr style='height: 78px;'><td style='width: 100%; height: 78px;'><h3 style='font-weight:normal'>" + requisitos + "</h3><p>&nbsp;</p></td></tr><tr style='height: 289px;'><td style='width: 100%; text-align: center; height: 289px;'><em>Todos Nuestros servicios son gratuitos</em><br /><p><a href='http://www.pgr.gob.sv'>www.pgr.gob.sv</a></p><p>Centro de Llamadas: 2231-9484</p><p>L&iacute;nea de Atenci&oacute;n para Personas con Discapacidad: 7095-7080</p><p>L&iacute;nea para denunciar Violencia contra la Mujer: 2231-9595</p><p>Quejas y Denuncias: 2231-9484</p><p>Whatsapp: 7607-9013</p><p>Instagram: pgr_sv</p><p>Twitter: @PGR_SV</p><p>Facebook: Procuraduria General de la Republica</p><p>Horario: Lunes a Viernes 8:00am a 4:00pm</p><p>&nbsp;</p></td></tr></tbody></table>";
            var newWin = window.open('', 'Print-Window');
            newWin.document.open();
            newWin.document.write('<html><body onload="window.print()">' + contenidoTicket + '</body></html>');
            newWin.document.close();
            setTimeout(function () {
                newWin.close();
            }, 10);
    
    }

