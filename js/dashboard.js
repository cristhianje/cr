// dashboard.js
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');

let salesChart = null;

function formatCurrency(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

// Protege a rota: se não autenticado, volta ao login
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  userEmailSpan.textContent = user.email;
  // Carrega dados de relatórios
  await loadReports();
});

logoutBtn.addEventListener('click', async () => {
  await auth.signOut();
  window.location.href = 'index.html';
});

async function loadReports(){
  // Tentamos buscar dados do Firestore na coleção 'sales'
  try {
    const snapshot = await db.collection('sales').get();
    if (!snapshot.empty) {
      // agregamos por mês
      const months = ['Jan','Fev','Mar','Apr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      let monthly = new Array(12).fill(0);
      let total = 0;
      let pedidos = 0;
      let productMap = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        // espera {date: firebase.Timestamp, amount: number, product: string, client: string}
        const date = d.date && d.date.toDate ? d.date.toDate() : new Date();
        const m = date.getMonth();
        const amt = Number(d.amount || 0);
        monthly[m] += amt;
        total += amt;
        pedidos += 1;
        const prod = d.product || 'Produto';
        productMap[prod] = (productMap[prod] || 0) + amt;
      });

      // KPIs
      document.getElementById('kpi-total').textContent = formatCurrency(total);
      document.getElementById('kpi-pedidos').textContent = pedidos;
      // clientes is approximate unique count
      // (if your documents include client name/email you can compute unique)
      document.getElementById('kpi-clientes').textContent = '—';

      // Chart
      renderSalesChart(monthly);

      // Top products table
      const sorted = Object.entries(productMap).sort((a,b)=>b[1]-a[1]);
      const tbody = document.querySelector('#topProducts tbody');
      tbody.innerHTML = '';
      sorted.slice(0,10).forEach((row,i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${row[0]}</td><td>${formatCurrency(row[1])}</td>`;
        tbody.appendChild(tr);
      });

      return;
    }
  } catch (err) {
    console.warn('Erro ao buscar Firestore:', err.message || err);
  }

  // --- fallback: dados estáticos se Firestore não estiver configurado ----
  const sampleMonthly = [12000,15000,14000,17000,18000,22000,24000,23000,26000,28000,30000,33000];
  document.getElementById('kpi-total').textContent = formatCurrency(sampleMonthly.reduce((a,b)=>a+b,0));
  document.getElementById('kpi-pedidos').textContent = 1289;
  document.getElementById('kpi-clientes').textContent = 452;
  renderSalesChart(sampleMonthly);

  const sampleProducts = [
    ['Pizza Margherita', 8450],
    ['Hambúrguer Especial', 6720],
    ['Lasanha Bolonhesa', 5890],
    ['Risotto de Camarão', 4630],
    ['Salmão Grelhado', 3980]
  ];
  const tbody = document.querySelector('#topProducts tbody');
  tbody.innerHTML = '';
  sampleProducts.forEach((row,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${row[0]}</td><td>${formatCurrency(row[1])}</td>`;
    tbody.appendChild(tr);
  });
}

function renderSalesChart(monthly){
  const ctx = document.getElementById('salesChart').getContext('2d');
  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  if (salesChart) salesChart.destroy();
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vendas (R$)',
        data: monthly,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      plugins: {legend:{display:true}},
      scales: { y: { beginAtZero: true } }
    }
  });
}