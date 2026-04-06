document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    const restaurante = document.getElementById('restaurante');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const button = form.querySelector('button');

    form.addEventListener('submit', async (e) => {
        if (button.disabled) return;
        e.preventDefault();
        if (document.getElementById('empresa_fake').value !== '') {
            return;
        }
        button.disabled = true;
        button.innerText = "Enviando...";
        const data = {
            restaurante: restaurante.value.trim(),
            nome: nome.value.trim(),
            email: email.value.trim(),
            telefone: limparTelefone(telefone.value)
        };

        if (data.nome.length < 2) {
            showToast('Nome muito curto', 'error');
            resetButton();
            return;
        }

        if (!/\S+@\S+\.\S+/.test(data.email)) {
            showToast('Email inválido', 'error');
            resetButton();
            return;
        }

        if (data.telefone.length < 10) {
            showToast('Telefone inválido', 'error');
            resetButton();
            return;
        }

        try {
            const response = await fetch('http://10.1.0.39:8080/Leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                showToast('Enviado com sucesso!', 'success');
                resetButton();
                form.reset();
            } else {
                const result = await response.json();
                showToast(result.error || 'Falha ao criar lead', 'error');
                resetButton();
            }

        } catch (error) {
            console.error(error);
            showToast('Erro de conexão com o servidor.', 'error');
        }
    })

    function limparTelefone(tel) {
        return tel.replace(/\D/g, '');
    }

    function resetButton() {
        button.disabled = false;
        button.innerText = "Quero conhecer o sistema";
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');

        toast.innerHTML = type === 'success'
            ? '✅ ' + message
            : '⚠️ ' + message;

        // toast.innerText = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }
});