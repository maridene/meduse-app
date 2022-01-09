const CsvParser = require('json2csv').Parser;
const ExcelJS = require('exceljs');

const clientFields = ["id", "name", "email", "phone", "creation date", "prefix", "points", "premium", "matricule fiscale"];

module.exports = {
    buildClientsResponse
};

function buildClientsResponse(res, data, format) {
    switch(format) {
        case 'csv': 
            buildClientsCsvResponse(res, data);
            break;
        case 'mexcel':
            buildClientsMExcelResponse(res, data);
            break;
        default:
            buildClientsCsvResponse(res, data);
            break;
    }
}

function buildClientsCsvResponse(res, data) {
    const csvParser = new CsvParser({ clientFields });
    const csvData = csvParser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=clients.csv");
    res.status(200).end(csvData);
}

function buildClientsMExcelResponse(res, data) {
    res.status(200);
    res.setHeader('Content-disposition', 'attachment; filename=clients.xlsx');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const options = {
        stream: res
    };
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
    setWorkbookProps(workbook);
    const sheet = workbook.addWorksheet('clients');
    //headers
    sheet.columns = [
        { header: 'Id', key: 'id'},
        { header: 'Name', key: 'name'},
        { header: 'D.O.B.', key: 'DOB'}
      ];
    sheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)}).commit();
    workbook.commit();
    res.end();
    /*
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="clients.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const workbook = new Excel.stream.xlsx.WorkbookWriter({});
    const buffer = await workbook.xlsx.writeBuffer();
    const worksheet = workbook.addWorksheet('some-worksheet');
    //worksheet.addRow(['foo', 'bar']).commit();
    //worksheet.commit();
    workbook.commit();
    res.end(buffer.toString('base64'));*/
}

function setWorkbookProps(workbook) {
    workbook.creator = 'Meduse';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
}



