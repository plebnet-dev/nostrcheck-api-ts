const initTable = (tableId, data, objectName) => {
    console.log('Initializing table:', tableId)
    console.log('Data:', data)

    var data = JSON.parse(data)
    if (data.length == 0) {data = [{id: '-'}]} // dummy data for table creation
    var arr = []
    data.forEach(element => {
        if(element.date) element.date = dateFormat(element.date)
        arr.push(element)});

    $(tableId).bootstrapTable({
        data: arr,
        uniqueId: 'id',
        pagination: true,
        search: true,
        searchClearButton: true,
        pageSize: 10,
        toolbar: tableId + '-toolbar',
        resizable: true,
        clickToSelect: true,
        showColumns: true,
        idField: 'id',
    })

    // Buttons logic
    $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        $(tableId + '-button-remove').prop('disabled', !$(tableId).bootstrapTable('getSelections').length)
        $(tableId + '-button-disable').prop('disabled', !$(tableId).bootstrapTable('getSelections').length)
        $(tableId + '-button-enable').prop('disabled', !$(tableId).bootstrapTable('getSelections').length)
        if ($(tableId).bootstrapTable('getSelections').length == 1) {
            $(tableId + '-button-admin').prop('disabled', false)
            $(tableId + '-button-edit').prop('disabled', false)
            $(tableId + '-button-password').prop('disabled', false)
        }
        else {
            $(tableId + '-button-add').prop('disabled', false)
            $(tableId + '-button-admin').prop('disabled', true)
            $(tableId + '-button-edit').prop('disabled', true)
            $(tableId + '-button-password').prop('disabled', true)
        }
    })

    // Add button
    $(tableId + '-button-add').click(function () {

        // Deselect all rows
        $(tableId).bootstrapTable('uncheckAll')

        // Create an empty row with same columns as table
        var row = {}
        $(tableId).bootstrapTable('getOptions').columns[0].forEach(element => {
            if (element.field != 'state'){
                row[element.field] = ''
            }
        });

        initEditModal(tableId,row,objectName, true).then((editedRow) => {
            if (editedRow) {
                // add a new row with modal form inputs
                $(tableId).bootstrapTable('insertRow', {
                    index: 0,
                    row: editedRow
                });
                $(tableId).bootstrapTable('uncheckAll')
            }
        });

        // TODO FETCH DATA TO SERVER
    }
    )

    // Disable button
    $(tableId + '-button-disable').click(async function () {
        var ids = $.map($(tableId).bootstrapTable('getSelections'), function (row) {
        return row.id
        })

        if (await initConfirmModal(tableId,ids,'disable',objectName)) {

            // Update active field from row id to reverse value
            for (let id of ids) {
                $(tableId).bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: {
                        active: 0,
                        visibility: 0
                    }
                });
            }
        }

        // TODO FETCH DATA TO SERVER
    })

    // Enable button
    $(tableId + '-button-enable').click(async function () {
        var ids = $.map($(tableId).bootstrapTable('getSelections'), function (row) {
        return row.id
        })

        if (await initConfirmModal(tableId,ids,'enable',objectName)) {

            // Update active field from row id to reverse value
            for (let id of ids) {
                $(tableId).bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: {
                        active: 1,
                        visibility: 1
                    }
                });
            }
        }

        // TODO FETCH DATA TO SERVER
    })

    // Admin button
    $(tableId + '-button-admin').click(async function () {
        var ids = $.map($(tableId).bootstrapTable('getSelections'), function (row) {
        return row.id
        })

        if (await initConfirmModal(tableId,ids,'toggle admin',objectName)) {

            // Update active field from row id to reverse value
            for (let id of ids) {
                let row = $(tableId).bootstrapTable('getRowByUniqueId', id);
                let allowed = row.allowed === 0 ? 1 : 0;
                $(tableId).bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: {
                        allowed: allowed
                    }
                });
            }
        }

        // TODO FECHT DATA TO SERVER

    })

     // Edit button
     $(tableId + '-button-edit').click(function () {
        // Get row data
        var row = $(tableId).bootstrapTable('getSelections')[0]
        initEditModal(tableId,row,objectName).then((editedRow) => {
            if (editedRow) {
                // Update rows with modal form inputs
                $(tableId).bootstrapTable('updateByUniqueId', {
                    id: row.id,
                    row: editedRow
                });
            }
        });

        // TODO FETCH DATA TO SERVER
        
    })

    // Remove button
    $(tableId + '-button-remove').click(async function () {
        var ids = $.map($(tableId).bootstrapTable('getSelections'), function (row) {
        return row.id
        })

        if (await initConfirmModal(tableId,ids,'remove',objectName)) {
            // Remove rows from table
            $(tableId).bootstrapTable('remove', {
                field: 'id',
                values: ids
            })
            $(tableId + '-button-remove').prop('disabled', true)
        }

        // TODO FETCH DATA TO SERVER

    })

   
}


function dateFormat(value) {
  return new Date(value).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}