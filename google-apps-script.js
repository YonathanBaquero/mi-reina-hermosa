/**
 * ============================================================================
 * CÓDIGO DE GOOGLE APPS SCRIPT PARA EL MURO DE FELICITACIONES
 * ============================================================================
 * 
 * GUÍA RÁPIDA DE CONFIGURACIÓN (Toma menos de 2 minutos):
 * 
 * 1. Entra a Google Drive (drive.google.com) o Google Sheets (sheets.new) y crea una nueva Hoja de Cálculo.
 * 2. Nómbrala: "Mensajes Cumpleaños Esposa".
 * 3. En el menú superior de la hoja, haz clic en:
 *      Extensiones -> Apps Script
 * 4. Borra cualquier código que aparezca allí y PEGA TODO EL CÓDIGO de este archivo.
 * 5. Haz clic en el botón azul "Implementar" (arriba a la derecha) -> "Nueva implementación".
 * 6. En el engranaje (Tipo de implementación), selecciona: "Aplicación web".
 * 7. Configura las siguientes 3 opciones:
 *      - Descripción: Muro de Cumpleaños
 *      - Ejecutar como: "Yo" (tu cuenta de Google)
 *      - Quién tiene acceso: "Cualquier usuario" (o "Anyone")  <--- ¡MUY IMPORTANTE!
 * 8. Haz clic en "Implementar", autoriza los permisos con tu cuenta de Google.
 * 9. COPIA LA "URL de la aplicación web" que termina en ".../exec".
 * 10. Ve a tu página del muro (muro.html), toca el icono de engranaje (⚙️) arriba a la derecha,
 *     pega la URL y haz clic en "Guardar y Conectar".
 * 
 * ¡Listo! A partir de ese momento, cada vez que cualquier persona entre desde su celular
 * y deje un mensaje, se guardará automáticamente en tu hoja de cálculo y se verá en el muro!
 * ============================================================================
 */

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();
    var messages = [];
    
    // Si hay filas (la fila 0 son los encabezados)
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (r[0] || r[2] || r[3]) { // Si tiene ID, Nombre o Mensaje
        messages.push({
          id: String(r[0] || ('msg_' + i)),
          timestamp: String(r[1] || ''),
          name: String(r[2] || 'Anónimo'),
          message: String(r[3] || ''),
          color: String(r[4] || 'yellow'),
          font: String(r[5] || 'caveat'),
          sticker: String(r[6] || '💖'),
          likes: Number(r[7]) || 0
        });
      }
    }
    
    // Invertir para que los más nuevos aparezcan de primero
    messages.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      count: messages.length,
      data: messages
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    // Si es una acción de like
    if (data.action === 'like') {
      var targetId = String(data.id || '');
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === targetId) {
          var currentLikes = Number(rows[i][7]) || 0;
          var newLikes = (data.increment === true) ? (currentLikes + 1) : Math.max(0, currentLikes - 1);
          sheet.getRange(i + 1, 8).setValue(newLikes);
          return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            action: 'like',
            id: targetId,
            likes: newLikes
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'not_found',
        message: 'Nota no encontrada para dar like'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var id = data.id || ('msg_' + new Date().getTime());
    var timestamp = Utilities.formatDate(new Date(), "America/Bogota", "dd/MM/yyyy, hh:mm a");
    var name = data.name || 'Anónimo';
    var message = data.message || '';
    var color = data.color || 'yellow';
    var font = data.font || 'caveat';
    var sticker = data.sticker || '💖';
    var likes = Number(data.likes) || 0;
    
    // Agregar la nueva fila en la hoja de cálculo
    sheet.appendRow([id, timestamp, name, message, color, font, sticker, likes]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Nota guardada exitosamente en Google Sheets',
      data: {
        id: id,
        timestamp: timestamp,
        name: name,
        message: message,
        color: color,
        font: font,
        sticker: sticker,
        likes: likes
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Si la hoja está totalmente vacía, crear los encabezados
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Fecha y Hora', 'Nombre', 'Mensaje', 'Color', 'Fuente', 'Sticker', 'Likes']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#ffe3ec');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}
