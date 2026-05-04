let clients = JSON.parse(localStorage.getItem('cl2') || '[]');
let sc = '#ffe500', cf = 'all', cur = '₵', compact = false, clkOn = true;

function pc(el) {
    document.querySelectorAll('.cdot').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    sc = el.dataset.c;
}

function openS() { document.getElementById('sov').classList.add('open'); }
function closeS() { document.getElementById('sov').classList.remove('open'); }

function fv(f, btn) {
    cf = f;
    document.querySelectorAll('.vtb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function addC() {
    const n = document.getElementById('cN').value.trim();
    if (!n) { toast2('Client name required'); return; }
    clients.push({
        id: Date.now(),
        name: n,
        project: document.getElementById('cP').value || 'General',
        value: parseFloat(document.getElementById('cV').value) || 0,
        status: document.getElementById('cSt').value,
        deadline: document.getElementById('cD').value,
        notes: document.getElementById('cNo').value,
        color: sc,
        added: new Date().toLocaleDateString()
    });
    save(); render(); updS();
    ['cN', 'cP', 'cV', 'cNo'].forEach(i => document.getElementById(i).value = '');
    toast2(n + ' added');
}

function delC(id) {
    clients = clients.filter(c => c.id !== id);
    save(); render(); updS();
    toast2('Removed');
}

function updSt(id, v) {
    const c = clients.find(x => x.id === id);
    if (c) { c.status = v; save(); render(); updS(); }
}

function render() {
    const list = document.getElementById('clist');
    const fl = cf === 'all' ? clients : clients.filter(c => c.status === cf);
    if (!fl.length) {
        list.innerHTML = `<div class="empty"><div class="empty-ico">📋</div><div class="empty-t">// NO ${cf.toUpperCase()} CLIENTS</div></div>`;
        return;
    }
    const sm = {
        active: { c: 's-active', l: 'ACTIVE' },
        pending: { c: 's-pending', l: 'PENDING' },
        overdue: { c: 's-overdue', l: 'OVERDUE' },
        completed: { c: 's-completed', l: 'DONE' }
    };
    list.innerHTML = fl.map(c => {
        const s = sm[c.status] || sm.active;
        const dl = c.deadline ? new Date(c.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        return `
        <div class="cc">
            <div class="cct">
                <div class="ccbar" style="background:${c.color}"></div>
                <div class="ccc">
                    <div class="ccr1">
                        <div class="ccname">${c.name}</div>
                        <div class="ccst ${s.c}"><div class="sdot"></div><span class="slb">${s.l}</span></div>
                    </div>
                    <div class="ccr2">
                        <span class="ccm">PROJECT: <span>${c.project}</span></span>
                        <span class="ccm">ADDED: <span>${c.added}</span></span>
                        ${dl ? `<span class="ccm">DUE: <span>${dl}</span></span>` : ''}
                    </div>
                    ${!compact && c.notes ? `<div class="ccnote">${c.notes}</div>` : ''}
                    <div class="ccft">
                        <span class="cctag">${c.status}</span>
                        <div class="cca">
                            <select class="fsel" style="padding:3px 8px;font-size:10px;width:auto" onchange="updSt(${c.id},this.value)">
                                <option${c.status === 'active' ? ' selected' : ''} value="active">Active</option>
                                <option${c.status === 'pending' ? ' selected' : ''} value="pending">Pending</option>
                                <option${c.status === 'overdue' ? ' selected' : ''} value="overdue">Overdue</option>
                                <option${c.status === 'completed' ? ' selected' : ''} value="completed">Done</option>
                            </select>
                            <button class="ccbtn d" onclick="delC(${c.id})">✕</button>
                        </div>
                    </div>
                </div>
                <div class="ccpay">${c.value > 0 ? cur + c.value.toLocaleString() : '—'}</div>
            </div>
        </div>`;
    }).join('');
}

function updS() {
    document.getElementById('stT').textContent = clients.length;
    document.getElementById('stA').textContent = clients.filter(c => c.status === 'active').length;
    document.getElementById('stO').textContent = clients.filter(c => c.status === 'overdue').length;
    const r = clients.reduce((s, c) => s + (c.value || 0), 0);
    document.getElementById('stR').textContent = cur + (r >= 1000 ? (r / 1000).toFixed(1) + 'k' : r);
}

function save() { localStorage.setItem('cl2', JSON.stringify(clients)); }

function toast2(m) {
    const t = document.getElementById('toastEl');
    t.textContent = '> ' + m;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

setInterval(() => {
    if (clkOn) document.getElementById('navClock').textContent = '// ' + new Date().toLocaleTimeString();
    else document.getElementById('navClock').textContent = '';
}, 1000);

// Sample data for first load
if (!clients.length) {
    clients = [
        { id: 1, name: 'Pixel Studio', project: 'Brand redesign', value: 3500, status: 'active', deadline: '2025-06-15', notes: '2 revisions done.', color: '#ffe500', added: 'May 1, 2025' },
        { id: 2, name: 'Nova Health', project: 'Dashboard UI', value: 1800, status: 'pending', deadline: '2025-05-20', notes: 'Invoice sent.', color: '#00b4ff', added: 'Apr 28, 2025' },
        { id: 3, name: 'Bloom Co.', project: 'E-commerce setup', value: 2200, status: 'overdue', deadline: '2025-04-30', notes: '3 follow-ups sent.', color: '#ff3b3b', added: 'Apr 10, 2025' }
    ];
    save();
}

render();
updS();