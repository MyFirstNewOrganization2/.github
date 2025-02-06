const startButton = document.getElementById('startMining');
const stopButton = document.getElementById('stopMining');
const modal = document.getElementById('consentModal');
const acceptButton = document.getElementById('acceptConsent');
const declineButton = document.getElementById('declineConsent');
const throttleSelect = document.getElementById('throttleSelect');
const hashRateDisplay = document.getElementById('hashrate');
const cpuUsageDisplay = document.getElementById('cpuUsage');
const cpuProgress = document.getElementById('cpuProgress');
const totalHashesDisplay = document.getElementById('totalHashes');
let miner;
let statsInterval;

startButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

acceptButton.addEventListener('click', () => {
    modal.style.display = 'none';
    startMining();
});

declineButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

stopButton.addEventListener('click', () => {
    stopMining();
});

function startMining() {
    const threads = parseInt(throttleSelect.value);
    
    miner = new WMP.User('SK_dMiOfcAntrBFwq7OEZ6mr', 'username', {
        threads: threads,
        throttle: 0, // Полная нагрузка, т.к. throttle теперь не используется
        forceASMJS: false
    });
    
    miner.start(WMP.IF_EXCLUSIVE_TAB);

    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';

    // Обновляем хешрейт, использование процессора и общее количество хешей каждые 1 секунду
    statsInterval = setInterval(() => {
        const hashRate = miner.getHashesPerSecond();
        hashRateDisplay.innerText = `${hashRate.toFixed(2)} H/s`;
        
        const cpuUsage = (threads / navigator.hardwareConcurrency) * 100;
        cpuUsageDisplay.innerText = `${cpuUsage.toFixed(0)}%`;
        cpuProgress.value = cpuUsage;

        const totalHashes = miner.getTotalHashes();
        totalHashesDisplay.innerText = totalHashes;

        const energyConsumption = estimateEnergyConsumption(cpuUsage);
        energyConsumptionDisplay.innerText = `${energyConsumption.toFixed(2)} Вт`;
    }, 1000);
}

function stopMining() {
    if (miner) {
        miner.stop();
        clearInterval(statsInterval);
        alert('Майнинг остановлен');

        // Сбрасываем значения
        hashRateDisplay.innerText = '0 H/s';
        cpuUsageDisplay.innerText = '0%';
        cpuProgress.value = 0;
        totalHashesDisplay.innerText = '0';

        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    }
}


function updateHashesSolved(hashes) {
    hashesSolvedText.textContent = 'Хэши решены: ' + hashes;

    hashesInterval = setInterval(() => {
        const hashes = miner.getTotalHashes();
        updateHashesSolved(hashes);
    }, 1000);
    
}

