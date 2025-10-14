import Help from "./Help"
import UserMenu from "./UserMenu"

export const Header = () => (
  <header className="sticky top-0 absolute inset-0 backdrop-blur-md -z-10 z-30">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-end h-16 border-b border-gray-700/60">
        <div className="flex items-center space-x-3">
          <Help />
          <hr className="w-px h-6 bg-gray-700/60 border-none" />
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
)

export default Header
