function handle_ajax(event) {
  console.log('DOM fully loaded and parsed');
  const authHeader = localStorage.getItem("authHeader");
  const resultsDiv = document.getElementById('results-div');
  const restOpsDiv = document.getElementById('rest-ops');
  const listMembersButton = document.getElementById('list-members');
  const createMemberButton = document.getElementById('create-member');
  const firstName = document.getElementById('member-firstName');
  const lastName = document.getElementById('member-lastName');
  const updateMemberButton = document.getElementById('update-member');
  const memberID = document.getElementById('member-id');
  const firstName1 = document.getElementById('member-firstName1');
  const lastName1 = document.getElementById('member-lastName1');

  // Add logic to the app/assets/javascripts/ajax_ops.js so that you can delete a member entry.
  const memberIDToDelete = document.getElementById("member-id-to-delete")
  const deleteMemberButton = document.getElementById('delete-member-button')

  // list all facts
  const listFactsMemberId = document.getElementById('list-facts-member-id')
  const listFactsButton = document.getElementById('list-facts-button')

  // create facts
  const memberIdToCreateFactTo = document.getElementById('member-id-to-create-fact-to')
  const factTextToCreate = document.getElementById('fact-text-to-create')
  const factLikesToCreate = document.getElementById('fact-likes-to-create')
  const createFactButton = document.getElementById('create-fact-button')

  // update facts
  const whichMemberIdToUpdateFactFrom = document.getElementById('which-member-id-to-update-fact-from')
  const whichFactIdToUpdate = document.getElementById('which-fact-id-to-update')
  const factTextToUpdate = document.getElementById('fact-text-to-update')
  const factLikesToUpdate = document.getElementById('fact-likes-to-update')
  const updateFactButton = document.getElementById('update-fact-button')

  // delete facts
  const whichMemberIdToDeleteFactFrom = document.getElementById('which-member-id-to-delete-fact-from')
  const whichFactIdToDelete = document.getElementById('which-fact-id-to-delete')
  const deleteFactButton = document.getElementById('delete-fact-button')
  const members_path = 'http://localhost:3001/api/v1/members';

  restOpsDiv.addEventListener('click', async (event) => {

    // event listener
    // listMembersButton
    if (event.target === listMembersButton) {
      fetch(members_path,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': authHeader
          }
        }
      ).then((response) => {
        if (response.status === 200) {
          resultsDiv.innerHTML = '';
          response.json().then((data) => {
            if (data.length === 0) {
              let parag = document.createElement('P')
              parag.textContent = "There are no members."
              resultsDiv.appendChild(parag)
            } else {
              for (let i = 0; i < data.length; i++) {
                let parag = document.createElement('P');
                parag.textContent = JSON.stringify(data[i]);
                resultsDiv.appendChild(parag);
              }
            }
          });
        } else {
          alert(`Return code ${response.status} ${response.statusText}`);
        }
      }).catch((error) => {
        console.log(error);
        alert(error);
      });

      // event listener
      // createMemberButton
    } else if (event.target === createMemberButton) {
      var dataObject = {
        first_name: firstName.value,
        last_name: lastName.value
      }
      fetch(members_path,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': authHeader
          },
          body: JSON.stringify(dataObject)
        }
      ).then((response) => {
        if (response.status === 201) {
          response.json().then((data) => {
            resultsDiv.innerHTML = '';
            let parag = document.createElement('P');
            parag.textContent = JSON.stringify(data);
            resultsDiv.appendChild(parag);
          });
        } else {
          response.json().then((data) => {
            alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
          }).catch((error) => {
            console.log(error);
            alert(error);
          });
        }
      });

      // event listener
      // updateMemberButton
    } else if (event.target === updateMemberButton) {
      var dataObject = {
        first_name: firstName1.value,
        last_name: lastName1.value
      }
      if (!dataObject.first_name) {
        delete dataObject.first_name
      }
      if (!dataObject.last_name) {
        delete dataObject.last_name
      }
      fetch(`${members_path}/${memberID.value}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': authHeader
          },
          body: JSON.stringify(dataObject)
        }
      ).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            resultsDiv.innerHTML = '';
            let parag = document.createElement('P');
            parag.textContent = JSON.stringify(data);
            resultsDiv.appendChild(parag);
          });
        } else {
          response.json().then((data) => {
            alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
          }).catch((error) => {
            console.log(error);
            alert(error);
          });
        }
      });

      /// Rails: AJAX Calling REST
      // AJAX Assignment

      // Add logic to the app/assets/javascripts/ajax_ops.js so that you can delete a member entry. You can use the existing event listener, with the new target being the delete button you create. This is similar to the update logic, but the method is ‘DELETE’ and there is no body to the request. You still have to specify the authentication header. Test it out to be sure it works.

      // event listener
      // deleteMemberButton
    } else if (event.target === deleteMemberButton) {
      try {
        const response = await fetch(`${members_path}/${memberIDToDelete.value}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': authHeader
            }
          })
        const data = await response.json()
        if (response.status === 200) {
          resultsDiv.innerHTML = ''
          let parag = document.createElement('P')
          parag.textContent = JSON.stringify(data)
          resultsDiv.appendChild(parag);
        } else {
          alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }

      // event listener
      // Add logic to the app/assets/javascripts/ajax_ops.js so that you can retrieve all the facts belonging to that member entry.
      // listFactsButton
    } else if (event.target === listFactsButton) {
      try {
        const response = await fetch(`${members_path}/${listFactsMemberId.value}/facts`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': authHeader
            }
          })
        const data = await response.json()
        if (response.status === 200) {
          resultsDiv.innerHTML = ''
          if (data.length === 0) {
            let parag = document.createElement('P')
            parag.textContent = "There are no facts for this member."
            resultsDiv.appendChild(parag)
          } else {
            for (let i = 0; i < data.length; i++) {
              let parag = document.createElement('P');
              parag.textContent = JSON.stringify(data[i]);
              resultsDiv.appendChild(parag);
            }
          }
        } else {
          alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }

      // event listener
      // You want to create a fact belonging to the member specified by the member_id.
      // You will need to send a POST request to the same URL as for the fact list request, with a JSON encoded body for the fact object to be created.
      // Note that the member_id is not in the JSON body because it is in the URL.
      // createFactButton
    } else if (event.target === createFactButton) {
      try {
        var dataObject = { fact_text: factTextToCreate.value, likes: factLikesToCreate.value }
        const response = await fetch(`${members_path}/${memberIdToCreateFactTo.value}/facts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': authHeader
            },
            body: JSON.stringify(dataObject)
          })
        const data = await response.json()
        if (response.status === 201) {
          resultsDiv.innerHTML = ''
          let parag = document.createElement('P')
          parag.textContent = JSON.stringify(data)
          resultsDiv.appendChild(parag);
        } else {
          alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }

      // event listener
      // add code to update entries, and test those changes too.
      // updateFactButton
    } else if (event.target === updateFactButton) {
      try {
        var dataObject = { fact_text: factTextToUpdate.value, likes: factLikesToUpdate.value }
        if (!dataObject.fact_text) {
          delete dataObject.fact_text
        }
        if (!(dataObject.likes===0) && !dataObject.likes) {
          delete dataObject.likes
        }
        const response = await fetch(`${members_path}/${whichMemberIdToUpdateFactFrom.value}/facts/${whichFactIdToUpdate.value}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'authorization': authHeader
            },
            body: JSON.stringify(dataObject)
          })
        const data = await response.json()
        if (response.status === 200) {
          resultsDiv.innerHTML = ''
          let parag = document.createElement('P')
          parag.textContent = JSON.stringify(data)
          resultsDiv.appendChild(parag);
        } else {
          alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }

      // event listener
      // add code to delele  entries, and test those changes too.
      // deleteFactButton
    } else if (event.target === deleteFactButton) {
      try {
        const response = await fetch(`${members_path}/${whichMemberIdToDeleteFactFrom.value}/facts/${whichFactIdToDelete.value}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': authHeader
            }
          })
        const data = await response.json()
        if (response.status === 200) {
          resultsDiv.innerHTML = ''
          let parag = document.createElement('P')
          parag.textContent = JSON.stringify(data)
          resultsDiv.appendChild(parag);
        } else {
          alert(`Return code ${response.status} ${response.statusText} ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', handle_ajax(event));
