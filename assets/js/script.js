// Gestion de l'envoi du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêche le rechargement de la page
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Simuler un envoi (vous pouvez remplacer par un vrai fetch vers votre back-end)
            console.log('Données envoyées :', data);
            
            // Afficher un message de succès
            afficherMessage('success', 'Message envoyé avec succès !');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        });
    }
    
    // Fonction pour afficher un message temporaire sous le formulaire
    function afficherMessage(type, texte) {
        // Supprimer un éventuel ancien message
        const ancienMessage = document.querySelector('.form-status');
        if (ancienMessage) ancienMessage.remove();
        
        // Créer l'élément message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-status ${type}`;
        messageDiv.textContent = texte;
        
        // Insérer après le bouton submit
        const submitBtn = document.querySelector('.contact-form button[type="submit"]');
        submitBtn.insertAdjacentElement('afterend', messageDiv);
        
        // Faire disparaître le message après 5 secondes
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});