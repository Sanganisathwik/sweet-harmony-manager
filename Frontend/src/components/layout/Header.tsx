import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Candy, LogOut, User, Settings, Menu, Home } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Candy className="h-8 w-8 text-primary" />
          <span className="hidden sm:inline font-serif text-2xl font-bold text-foreground">Sweet Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sweets">Sweets</Link>
          </Button>
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                <Link to="/sweets">Sweets</Link>
              </Button>
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">{user.email}</p>
                    <Button variant="outline" className="w-full justify-start" onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Link to="/auth">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Link to="/auth?mode=signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
