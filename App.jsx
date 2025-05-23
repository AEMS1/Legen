
import LivePrice from "./components/LivePrice";

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Legend Betting DApp</h1>
      <LivePrice />
      {/* سایر بخش‌ها اینجا اضافه خواهد شد */}
    </div>
  );
}

export default App;
