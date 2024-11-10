import {
  Bars3Icon,
  BuildingOfficeIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toggleMenu } from "../features/app/appSlice";
import LocationModal from "./LocationModal";
import Logo from "./Logo";

const Header = () => {
  const { isMenuOpen, isLocationModalOpen } = useSelector((state) => state.app);

  const dispatch = useDispatch();

  const handleToggleMenu = () => dispatch(toggleMenu());

  const isAuthenticated = localStorage.getItem("token") === null ? false : true;

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <header className="sticky w-full top-0 bg-white z-20 py-4 border-b shadow-sm border-gray-100">
      <div className="container-max flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo />
        </div>

        {isLocationModalOpen ? <LocationModal /> : null}

        <ul className="text-zinc-700 ml-auto gap-2 md:gap-4 items-center hidden md:flex">
          <li>
            <Link
              to="/restaurants"
              className="p-2 md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <BuildingOfficeIcon className="w-4 h-4 text-gray-700" />
              <p className="hidden md:block">Restaurants</p>
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
              <p className="hidden md:block">Cart</p>
            </Link>
          </li>
          <li>
            <Link
              to="/order"
              className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
              <p className="hidden md:block">Order</p>
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                    Login
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                    Signup
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>

        {!isMenuOpen ? (
          <div className="shadow-lg transition-all fixed top-full -right-[100%] bg-white h-screen p-4 px-8">
            <>
              <ul className="text-zinc-700 space-y-4">
                <li>
                  <Link
                    to="/restaurants"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-700" />
                    <p>Restaurants</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
                    <p>Cart</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
                    <p>Order</p>
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2  md:flex"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/login">
                        <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                          Login
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup">
                        <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                          Signup
                        </button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </>
          </div>
        ) : (
          <div className="shadow-lg transition-all md:hidden absolute top-full right-0 bg-white h-screen p-4 px-8">
            <>
              <ul className="text-zinc-700 space-y-4">
                <li>
                  <Link
                    to="/restaurants"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-700" />
                    <p>Restaurants</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
                    <p>Cart</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order"
                    className="p-2 relative md:px-4 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <ShoppingBagIcon className="w-4 h-4 text-gray-700" />{" "}
                    <p>Order</p>
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2  md:flex"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/login">
                        <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                          Login
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup">
                        <button className="ml-4 bg-orange-400 text-white p-2 px-4 rounded-md items-center gap-2 hidden md:flex">
                          Signup
                        </button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </>
          </div>
        )}

        <button className="block md:hidden" onClick={handleToggleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
export default Header;
