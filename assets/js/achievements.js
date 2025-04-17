class AchievementSystem {
  constructor() {
    this.achievements = {};
    this.queue = [];
    this.isShowing = false;

    // this.loadFromStorage();
    this.setupStyles();
  }

  addAchievement(id, name, description, iconUrl) {
    this.achievements[id] = { name, description, iconUrl, unlocked: false };
  }

  unlock(id) {
    if (!this.achievements[id] || this.achievements[id].unlocked) return;

    this.achievements[id].unlocked = true;
    this.saveToStorage();

    if (!this.queue.some(ach => ach.id === id)) {
      this.queue.push(this.achievements[id]);
    }

    const achievementEl = document.querySelector(`.achievement[data-id="${id}"]`);
    if (achievementEl) {
      achievementEl.classList.add('unlocked');
    }

    if (!this.isShowing) {
      this.showNext();
    }
  }

  saveToStorage() {
    const unlockedIds = Object.keys(this.achievements).filter(id => this.achievements[id].unlocked);
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedIds));
  }

  loadFromStorage() {
    const saved = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
    for (const id of saved) {
      if (this.achievements[id]) {
        this.achievements[id].unlocked = true;

        const el = document.querySelector(`.achievement[data-id="${id}"]`);
        if (el) {
          el.classList.add('unlocked');
          console.log(`✔ Added .unlocked to`, el);
        } else {
          console.warn(`⚠ Element not found for data-id="${id}"`);
        }
      }
    }
  }

  showNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const achievement = this.queue.shift();
    this.displayAchievement(achievement);
  }

  displayAchievement(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">
          <img src="${achievement.iconUrl || 'default-icon.png'}" alt="${achievement.name}">
        </div>
        <div class="achievement-content">
          <div class="achievement-title">Achievement Unlocked</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
        this.showNext();
      }, 500);
    }, 5000);
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .achievement-notification {
          position: fixed;
          bottom: 20px;
          right: -400px;
          width: 350px;
          padding: 15px;
          background: rgba(32, 32, 32, 0.9);
          border-left: 4px solid #8e8ad9;
          color: white;
          font-family: Exo2;
          border-radius: 4px 0 0 4px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          transition: right 0.5s ease-in-out;
          z-index: 1000;
        }
        
        .achievement-notification.show {
          right: 0;
        }
        
        .achievement-icon {
          margin-right: 15px;
        }
        
        .achievement-icon img {
          width: 64px;
          height: 64px;
        }
        
        .achievement-content {
          flex: 1;
        }
        
        .achievement-title {
          color: #8e8ad9;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .achievement-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .achievement-desc {
          font-size: 14px;
          color: #ccc;
        }
      `;
    document.head.appendChild(style);
  }
}

function populateAchievements() {
  achievements.addAchievement(
    'firstGuess',
    'First Guess!',
    'Make your first guess.',
    'assets/images/rolling-dices.png'
  );
  achievements.addAchievement(
    'correctGuess',
    'Correct Guess!',
    'Guess the number correctly at least once.',
    'assets/images/paper-plane.png'
  );
  achievements.addAchievement(
    'fastThinker',
    'Fast Thinker',
    'Guess the correct number in 5 attempts or less.',
    'assets/images/brainstorm.png'
  );
  achievements.addAchievement(
    'luckyShot',
    'Lucky Shot',
    'Guess the number on the first try.',
    'assets/images/bullseye.png'
  );
  achievements.addAchievement(
    'sniper',
    'Sniper',
    'Guess the number in three attempts or less.',
    'assets/images/eye-target.png'
  );
  achievements.addAchievement(
    'slowSteady',
    'Slow and Steady',
    'Take more than 20 guesses but still win.',
    'assets/images/sands-of-time.png'
  );
  achievements.addAchievement(
    'consistentWinner',
    'Consistent Winner',
    'Win 3 times in a row within a session.',
    'assets/images/trophies-shelf.png'
  );
  achievements.addAchievement(
    'guessingVeteran',
    'Guessing Veteran',
    'Play 50 rounds in total.',
    'assets/images/rank-3.png'
  );
}

function resetAchievements() {
  localStorage.removeItem('unlockedAchievements');
  location.reload();
  //localStorage.clear();
  console.log("Achievements reset");
}