
import App from "./App"
import Home from "./pages/Home"
import { RouteObject, createBrowserRouter } from "react-router-dom"
import Merger from "./pages/Merger"
import Converter from "./pages/Converter"
import Trimmer from "./pages/Trimmer"
import Mixer from "./pages/Mixer"


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
    ]
  },
]

const router = createBrowserRouter(routeConfig);

export default router;
