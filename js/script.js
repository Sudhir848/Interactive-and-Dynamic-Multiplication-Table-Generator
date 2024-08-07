/*
Copyright (c) 2024 by Sudhir Gunaseelan. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Updated by SG on June 10, 2024, at 11:00 PM.
*/

$(document).ready(function() {
    let tableCount = 0;

    // Checking the range
    $.validator.addMethod("lessThan", function(value, element, params) {
        if ($(params).val()) {
            return parseInt(value) <= parseInt($(params).val());
        }
        return true;
    }, "Minimum value must be less than or equal to maximum value.");

    $("#multiplicationForm").validate({
        rules: {
            startY: {
                required: true,
                number: true,
                range: [-50, 50],
                lessThan: "#endY"
            },
            endY: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            startX: {
                required: true,
                number: true,
                range: [-50, 50],
                lessThan: "#endX"
            },
            endX: {
                required: true,
                number: true,
                range: [-50, 50]
            }
        },
        messages: {
            startY: {
                required: "Please enter a minimum column value.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50.",
                lessThan: "Minimum column value must be less than or equal to maximum column value."
            },
            endY: {
                required: "Please enter a maximum column value.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50."
            },
            startX: {
                required: "Please enter a minimum row value.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50.",
                lessThan: "Minimum row value must be less than or equal to maximum row value."
            },
            endX: {
                required: "Please enter a maximum row value.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50."
            }
        },
        errorPlacement: function(error, element) {
            error.addClass('error');
            error.insertAfter(element);
        },
        submitHandler: function(form) {
            saveTable();
            return false;
        }
    });

    // Sliders for table ranges
    $(".slider").each(function() {
        var inputId = $(this).prev("input").attr("id");
        var sliderId = $(this).attr("id");

        $(this).slider({
            min: -50,
            max: 50,
            slide: function(event, ui) {
                $("#" + inputId).val(ui.value).trigger("input");
            },
            change: function(event, ui) {
                $("#" + inputId).val(ui.value).trigger("input");
            }
        });

        $("#" + inputId).on("input change", function() {
            $("#" + sliderId).slider("value", $(this).val());
            updateTable();
        });
    });

    $("#startX, #endX, #startY, #endY").on("input change", function() {
        console.log("Input changed:", $(this).attr('id'), $(this).val());
        $("#multiplicationForm").valid() && updateTable();
    });

    $("#tabs").tabs();

    // Generate multiplication table
    function updateTable() {
        const startX = parseInt(document.getElementById('startX').value);
        const endX = parseInt(document.getElementById('endX').value);
        const startY = parseInt(document.getElementById('startY').value);
        const endY = parseInt(document.getElementById('endY').value);

        console.log("Updating table with values:", startX, endX, startY, endY);

        if (startX === 0 && endX === 0 && startY === 0 && endY === 0) {
            const tableHTML = '<table><tr><th class="sticky"></th><th class="sticky">0</th></tr><tr><th class="sticky sticky-left">0</th><td>0</td></tr></table>';
            if ($("#tabs .ui-tabs-panel").length === 0) {
                addNewTab(tableHTML, true);
            } else {
                const activeTab = $("#tabs").tabs("option", "active");
                const activeTabId = $("#tabs .ui-tabs-panel").eq(activeTab).attr("id");
                $("#" + activeTabId + " .table-container").html(tableHTML);
                updateTabLabel(activeTab, startX, endX, startY, endY);
            }
        } else {
            const tableHTML = createTableHTML(startX, endX, startY, endY);
            if ($("#tabs .ui-tabs-panel").length === 0) {
                addNewTab(tableHTML, true);
            } else {
                const activeTab = $("#tabs").tabs("option", "active");
                const activeTabId = $("#tabs .ui-tabs-panel").eq(activeTab).attr("id");
                $("#" + activeTabId + " .table-container").html(tableHTML);
                updateTabLabel(activeTab, startX, endX, startY, endY);
            }
        }
    }

    // Save the table to a new tab
    function saveTable() {
        const startX = parseInt(document.getElementById('startX').value);
        const endX = parseInt(document.getElementById('endX').value);
        const startY = parseInt(document.getElementById('startY').value);
        const endY = parseInt(document.getElementById('endY').value);

        const tableHTML = createTableHTML(startX, endX, startY, endY);
        addNewTab(tableHTML, true);
    }

    // Add new tab when saving the table
    function addNewTab(tableHTML, replaceInputTab = false) {
        tableCount++;
        const startX = parseInt(document.getElementById('startX').value);
        const endX = parseInt(document.getElementById('endX').value);
        const startY = parseInt(document.getElementById('startY').value);
        const endY = parseInt(document.getElementById('endY').value);
        const tabId = "tab-" + tableCount;
        const tabLabel = `(${startX}-${endX}, ${startY}-${endY})`;

        if (replaceInputTab && tableCount === 1) {
            // Replace the Input tab with the first table
            $("#tabs ul li:first-child").html(`<input type='checkbox' class='tab-checkbox' data-tab='${tabId}'><a href='#${tabId}'>${tabLabel}</a><span class='ui-icon ui-icon-close' role='presentation'></span>`);
            $("#tabs #tab-1").attr("id", tabId).html(`<div class="table-container">${tableHTML}</div>`);
        } else {
            $("#tabs ul").append(`<li><input type='checkbox' class='tab-checkbox' data-tab='${tabId}'><a href='#${tabId}'>${tabLabel}</a><span class='ui-icon ui-icon-close' role='presentation'></span></li>`);
            $("#tabs").append(`<div id='${tabId}' class="ui-tabs-panel"><div class="table-container">${tableHTML}</div></div>`);
        }

        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", $("#tabs ul li").length - 1);

        var nav = $(".ui-tabs-nav");
        nav.animate({
            scrollLeft: nav.prop("scrollWidth")
        }, 800);

        $("#tabs").on("click", "span.ui-icon-close", function() {
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            $("#tabs").tabs("refresh");
        });
    }

    function updateTabLabel(index, startX, endX, startY, endY) {
        const tabLabel = `(${startX}-${endX}, ${startY}-${endY})`;
        $("#tabs ul li").eq(index).find("a").text(tabLabel);
    }

    function createTableHTML(startX, endX, startY, endY) {
        let tableHTML = '<table>';
        tableHTML += '<tr><th class="sticky"></th>';

        for (let x = startY; x <= endY; x++) {
            tableHTML += `<th class="sticky">${x}</th>`;
        }

        tableHTML += '</tr>';

        for (let y = startX; y <= endX; y++) {
            tableHTML += `<tr><th class="sticky sticky-left">${y}</th>`;
            for (let x = startY; x <= endY; x++) {
                tableHTML += `<td>${x * y}</td>`;
            }
            tableHTML += '</tr>';
        }

        tableHTML += '</table>';

        return tableHTML;
    }

    // Delete selected tabs
    $("#deleteSelected").on("click", function() {
        $(".tab-checkbox:checked").each(function() {
            var tabId = $(this).data("tab");
            $("a[href='#" + tabId + "']").closest("li").remove();
            $("#" + tabId).remove();
        });
        $("#tabs").tabs("refresh");
    });

    $("#resetSliders").on("click", function() {
        $("#startX").off("input change");
        $("#endX").off("input change");
        $("#startY").off("input change");
        $("#endY").off("input change");

        console.log("Resetting input fields");
        $("#startX").val(0);
        $("#endX").val(0);
        $("#startY").val(0);
        $("#endY").val(0);

        console.log("Resetting sliders");
        $("#slider-startX").slider("value", 0);
        $("#slider-endX").slider("value", 0);
        $("#slider-startY").slider("value", 0);
        $("#slider-endY").slider("value", 0);

        $("#startX").on("input change", function() {
            $("#slider-startX").slider("value", $(this).val());
            updateTable();
        });
        $("#endX").on("input change", function() {
            $("#slider-endX").slider("value", $(this).val());
            updateTable();
        });
        $("#startY").on("input change", function() {
            $("#slider-startY").slider("value", $(this).val());
            updateTable();
        });
        $("#endY").on("input change", function() {
            $("#slider-endY").slider("value", $(this).val());
            updateTable();
        });

        console.log("Triggering change events");
        $("#startX").trigger("change");
        $("#endX").trigger("change");
        $("#startY").trigger("change");
        $("#endY").trigger("change");

        console.log("Updating table");
        updateTable();
    });

    // Delete enabled by default
    $("#deleteSelected").prop("disabled", false);
});