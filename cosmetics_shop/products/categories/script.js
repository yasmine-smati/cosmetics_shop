document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#categoryForm');
    const subcategoriesContainer = document.querySelector('#subcategories');

    // Add new subcategory input dynamically
    subcategoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-subcategory')) {
            const newSubcategory = document.createElement('div');
            newSubcategory.classList.add('form-group', 'd-flex');
            newSubcategory.innerHTML = `
                <input type="text" class="form-control subcategory-input" placeholder="Nom de la sous-catégorie">
                <button type="button" class="btn btn-danger ml-2 remove-subcategory">-</button>
            `;
            subcategoriesContainer.appendChild(newSubcategory);
        }
    });

    // Remove subcategory input dynamically
    subcategoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-subcategory')) {
            e.target.parentElement.remove();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const categoryName = document.querySelector('#categoryName').value;
        const subcategoryInputs = document.querySelectorAll('.subcategory-input');
        const subcategories = Array.from(subcategoryInputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (categoryName.trim() === '') {
            alert('Veuillez entrer un nom de catégorie.');
            return;
        }

        if (subcategories.length === 0) {
            alert('Veuillez entrer au moins une sous-catégorie.');
            return;
        }

        fetch('../../api/categories/addCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryName, subcategories })
        })
        .then(response => response.text()) // Utiliser .text() pour déboguer
        .then(rawData => {
            window.location.href = './categoriesList.php';
            let data;
            try {
                data = JSON.parse(rawData);
                if (data.status === 'success') {
                    alert('Catégorie ajoutée avec succès.');
                    window.location.href = './categoriesList.php';
                } else {
                    alert('Erreur lors de l\'ajout de la catégorie.');
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Erreur de parsing JSON :', error);
                alert('La réponse du serveur n\'est pas valide : ' + rawData);
            }
        })
        .catch(error => {
            console.error('Erreur réseau ou serveur :', error);
            alert('Une erreur s\'est produite.');
        });

    });
});