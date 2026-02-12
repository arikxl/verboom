


const InstructionsScreen = ({ user, onStart, onLogout }) => {
  return (
    <div className="page instructions-page">
      <h2>שלום, {user?.displayName} 👋</h2>
      <div className="rules-box">
        <h3>איך משחקים?</h3>
        <ul>
          <li>מקבלים פועל במקור והנחיה להטיה (גוף וזמן).</li>
          <li>תשובה נכונה = <strong>נקודה אחת</strong>.</li>
          <li>3 תשובות נכונות ברצף = <strong>בונוס של 2 נקודות</strong> 🔥</li>
          <li>ניתן להשתמש ברמזי הגייה (1-) או תרגום (2-).</li>
        </ul>
      </div>

      <button className="main-btn play-btn" onClick={onStart}>
        בוא נתחיל! (Play)
      </button>

      <button className="text-btn" onClick={onLogout}>התנתק</button>
    </div>
  );
};

export default InstructionsScreen;