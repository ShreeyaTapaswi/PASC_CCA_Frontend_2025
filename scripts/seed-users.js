const fs = require('fs');

async function seedUsers() {
  const divisions = 13;
  const studentsPerDiv = 30;
  const maxRollInClass = 80;

  const usersToCreate = [];

  // Helper to get 30 random unique numbers between 1 and 80
  const getRandomRolls = () => {
    const rolls = new Set();
    while (rolls.size < studentsPerDiv) {
      rolls.add(Math.floor(Math.random() * maxRollInClass) + 1);
    }
    return Array.from(rolls);
  };

  // Generate for FY (year = 1)
  for (let div = 1; div <= divisions; div++) {
    const rolls = getRandomRolls();
    for (const roll of rolls) {
      const rollStr = `1${String(div).padStart(2, '0')}${String(roll).padStart(2, '0')}`;
      usersToCreate.push({
        name: `FY Student ${rollStr}`,
        email: `pasc-${String(div).padStart(2, '0')}-${String(roll).padStart(2, '0')}@gmail.com`,
        password: `Password@123`,
        department: `CE`,
        year: 1,
        passoutYear: 2028, // Example FY passout year
        roll: Number(rollStr),
        hours: 0,
      });
    }
  }

  // Generate for SY (year = 2)
  for (let div = 1; div <= divisions; div++) {
    const rolls = getRandomRolls();
    for (const roll of rolls) {
      const rollStr = `2${String(div).padStart(2, '0')}${String(roll).padStart(2, '0')}`;
      usersToCreate.push({
        name: `SY Student ${rollStr}`,
        email: `pasc-${String(div).padStart(2, '0')}-${String(roll).padStart(2, '0')}@gmail.com`,
        password: `Password@123`,
        department: `CE`,
        year: 2,
        passoutYear: 2027, // Example SY passout year
        roll: Number(rollStr),
        hours: 0,
      });
    }
  }

  console.log(`Generated ${usersToCreate.length} user payloads. Saving to users.json for reference...`);
  fs.writeFileSync('users.json', JSON.stringify(usersToCreate, null, 2));

  // The backend API URL (assuming it runs locally on 4000)
  const API_URL = 'http://localhost:4000/api/auth/user/register';

  console.log('Starting API requests to register users...');
  
  let successCount = 0;
  let failCount = 0;

  // We use standard fetch available in modern Node.js
  for (let i = 0; i < usersToCreate.length; i++) {
    const user = usersToCreate[i];
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        successCount++;
        process.stdout.write(`\rSuccessfully registered: ${successCount} / ${usersToCreate.length}`);
      } else {
        failCount++;
        console.error(`\nFailed for ${user.roll}:`, data.error || 'Unknown error');
      }
    } catch (error) {
      failCount++;
      console.error(`\nNetwork Error for ${user.roll}:`, error.message);
    }
    
    // Small delay to prevent overwhelming the local server
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n\nSeeding complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

seedUsers().catch(console.error);
