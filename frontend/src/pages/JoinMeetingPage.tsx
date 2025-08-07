import { CameraPreview } from "../components/camera-preview";
import { Header } from "../components/Header";
import { JoinOptions } from "../components/join-options";
import { PreMeetingControls } from "../components/pre-meeting-controls";
import { useTheme } from "../themes/theme-provider";
function JoinMeetingPage() {
  const { theme } = useTheme();
  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <JoinOptions />
          </div>
          <div className="space-y-6">
            <CameraPreview />
            <PreMeetingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
export default JoinMeetingPage;
