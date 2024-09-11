// script.js
$(document).ready(function() {

     // Hide all sections initially
     $('.section').hide();

     // Show specific section based on button click
     $('#show-data-button').on('click', function() {
         $('.section').hide();
         $('#show-data-section').show();
     });

     $('#add-button').on('click', function() {
         $('.section').hide();
         $('#add-record-section').show();
     });

     $('#delete-button-1').on('click', function() {
         $('.section').hide();
         $('#delete-record-section').show();
     });

     $('#update-button-1').on('click', function() {
         $('.section').hide();
         $('#update-record-section').show();
     });

    // Function to fetch and display data
    function fetchData() {
        $.ajax({
            url: '/data',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#data-table tbody');
                var noDataMessage = $('#no-data-message');
                
                // Clear the table body
                tableBody.empty();
                
                if (data.length > 0) {
                    $('#data-table').removeClass('d-none');
                    noDataMessage.addClass('d-none');
                    
                    $.each(data, function(index, row) {
                        var rowHtml = '<tr>' +
                            '<td>' + row.ID + '</td>' +
                            '<td>' + row.Name + '</td>' +
                            '<td>' + row.CNIC + '</td>' +
                            '<td>' + row.Course + '</td>' +
                            '<td>' + row.Grade + '</td>' +
                            '<td>' + row.GPA + '</td>' +
                            '</tr>';
                        tableBody.append(rowHtml);
                    });
                } else {
                    $('#data-table').addClass('d-none');
                    noDataMessage.removeClass('d-none');
                }




                // var dataContainer = $('#data-container');
                // dataContainer.empty(); // Clear existing content

                // $.each(data, function(index, row) {
                //     var rowHtml = '<tr>' +
                //         '<td>' + row.ID + '</td>' +
                //         '<td>' + row.Name + '</td>' +
                //         '<td>' + row.CNIC + '</td>' +
                //         '<td>' + row.Course + '</td>' +
                //         '<td>' + row.Grade + '</td>' +
                //         '<td>' + row.GPA + '</td>' +
                //         '</tr>';
                //     dataContainer.append(rowHtml);
                // });

                // $.each(data, function(index, row) {
                //     var div = $('<div>');
                //     div.html('ID: ' + row.ID + '  Name:  ' + row.Name + '    CNIC:  ' + row.CNIC + 'Course:' + row.Course + 'Grade:' + row.Grade + 'GPA:' + row.GPA);
                //     dataContainer.append(div);
                // });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });}
      // Set up the click event handler for the fetch button
      $('#fetch-data-button').on('click', function() {
        fetchData(); // Call the fetchData function when the button is clicked
    });


    $('#form').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        
        var formData = {
            name: $('#name').val(),
            cnic: $('#cnic').val(),
            course: $('#course').val(),
            grade: $('#grade').val(),
            gpa: $('#gpa').val()
        };
        
        $.ajax({
            url: '/add-data',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                alert(response)
                
            },
            error: function(xhr, status, error) {
                alert('Error adding data:', error);
            }
        });
    });


    $('#update-button').on('click', function() {
        var userId = $('#update-id').val();
        var updateName = $('#update-name').val();
        var updateCnic = $('#update-cnic').val();
        var updateCourse = $('#update-course').val();
        var updateGrade = $('#update-grade').val();
        var updateGPA = $('#update-gpa').val();
    
        if (userId) {
            // Prepare the data to send, only including fields with values
            var updateData = {};
            if (updateName) updateData.name = updateName;
            if (updateCnic) updateData.cnic = updateCnic;
            if (updateCourse) updateData.course = updateCourse;
            if (updateGrade) updateData.grade = updateGrade;
            if (updateGPA) updateData.gpa = updateGPA;
    
            if (Object.keys(updateData).length > 0) {
                $.ajax({
                    url: `/update-user/${userId}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(updateData),
                    success: function(response) {
                        alert(response.message);
                        
                        // Clear the form fields
                        $('#update-id').val('');
                        $('#update-name').val('');
                        $('#update-cnic').val('');
                        $('#update-course').val('');
                        $('#update-grade').val('');
                        $('#update-gpa').val('');
                    },
                    error: function(xhr, status, error) {
                        alert('Error updating user: ' + error);
                    }
                });
    
            } else {
                alert('Please enter at least one field to update');
            }
        } else {
            alert('Please enter an ID to update');
        }
    });
    
    


     // Delete data when the delete button is clicked
     $('#delete-button').on('click', function() {
        var userId = $('#delete-id').val(); // Get the ID from the input field

        if (userId) {
            $.ajax({
                url: `/delete-user/${userId}`,
                method: 'DELETE',
                success: function(response) {
                    alert(response.message);
                   
                },
                error: function(xhr, status, error) {
                    alert('Error deleting user:', error);
                }
            });
        } else {
            alert('Please enter an ID to delete.');
        }
    });

    

});