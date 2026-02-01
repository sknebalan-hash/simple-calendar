import { TeamProvider } from './contexts/TeamContext';
import { ChoreProvider } from './contexts/ChoreContext';
import { MainLayout } from './components/layout';
import { ChoreCalendar } from './components/calendar';

function App() {
  return (
    <TeamProvider>
      <ChoreProvider>
        <MainLayout>
          <div className="h-[calc(100vh-8rem)]">
            <ChoreCalendar />
          </div>
        </MainLayout>
      </ChoreProvider>
    </TeamProvider>
  );
}

export default App;
