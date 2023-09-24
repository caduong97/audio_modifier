
import App from "./App"
import Home from "./pages/Home"
import { RouteObject, createBrowserRouter } from "react-router-dom"
import Merger from "./pages/Merger"
import Converter from "./pages/Converter"
import Trimmer from "./pages/Trimmer"
import Mixer from "./pages/Mixer"
import SteoreoToMono from "./pages/SteoreoToMono"
import MonoToStereo from "./pages/MonoToStereo"
import PitchShifter from "./pages/PitchShifter"
import FadeInOut from "./pages/FadeInOut"


export const routeConfig: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        id: "Home",
        element: <Home />
      },
      {
        path: "/merger",
        id: "Merger",
        element: <Merger />
      },
      {
        path: "/converter",
        id: "Converter",
        element: <Converter />
      },
      {
        path: "/trimmer",
        id: "Trimmer",
        element: <Trimmer />
      },
      {
        path: "/mixer",
        id: "Mixer",
        element: <Mixer />
      },
      {
        path: "/stereo-to-mono",
        id: "Stereo To Mono",
        element: <SteoreoToMono />
      },
      {
        path: "/mono-to-stereo",
        id: "Mono To Stereo",
        element: <MonoToStereo />
      },
      {
        path: "/pitch-shifter",
        id: "Pitch Shifter",
        element: <PitchShifter />
      },
      {
        path: "/fade-in-out",
        id: "Fade In Out",
        element: <FadeInOut />
      },
    ]
  },
]

const router = createBrowserRouter(routeConfig);

export default router;
