import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext(null);
const RouteParamsContext = createContext({});
const OutletContext = createContext(null);

export function Router({ children }) {
  const [location, setLocation] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });

  useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
    const [path, search = ''] = to.split('?');
    const fullSearch = search ? `?${search}` : '';
    if (options.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setLocation({
      pathname: path || '/',
      search: fullSearch,
    });
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export const BrowserRouter = Router;

export function useLocation() {
  const ctx = useContext(RouterContext);
  return ctx?.location || { pathname: window.location.pathname, search: window.location.search };
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  return ctx?.navigate || ((to) => { window.location.href = to; });
}

export function useParams() {
  return useContext(RouteParamsContext) || {};
}

export function useSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const setSearchParams = (nextParams) => {
    const query = typeof nextParams === 'function' ? nextParams(searchParams) : nextParams;
    const str = new URLSearchParams(query).toString();
    navigate(`${location.pathname}${str ? `?${str}` : ''}`);
  };

  return [searchParams, setSearchParams];
}

export function Link({ to, children, className, style, onClick, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...props}>
      {children}
    </a>
  );
}

export function Navigate({ to, replace }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace]);
  return null;
}

export function Outlet() {
  const child = useContext(OutletContext);
  return child || null;
}

function matchPath(routePath, currentPath) {
  if (routePath === '*') return { match: true, params: {} };

  const normCurrent = (currentPath || '/').replace(/\/+$/, '') || '/';
  const normRoute = (routePath || '/').replace(/\/+$/, '') || '/';

  if (normRoute === normCurrent) {
    return { match: true, params: {} };
  }

  const routeParts = normRoute.split('/').filter(Boolean);
  const currentParts = normCurrent.split('/').filter(Boolean);

  if (routeParts.length !== currentParts.length) {
    return { match: false, params: {} };
  }

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    const r = routeParts[i];
    const c = currentParts[i];
    if (r.startsWith(':')) {
      params[r.slice(1)] = decodeURIComponent(c);
    } else if (r !== c) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

export function Routes({ children }) {
  const { pathname } = useLocation();
  const routes = React.Children.toArray(children);

  for (const route of routes) {
    if (!React.isValidElement(route)) continue;

    // Nested layout route handling
    if (route.props.element && route.props.children) {
      const parentPath = (route.props.path || '').replace(/\/+$/, '');
      const childRoutes = React.Children.toArray(route.props.children);

      for (const child of childRoutes) {
        if (!React.isValidElement(child)) continue;

        let fullPath;
        if (child.props.index) {
          fullPath = parentPath || '/';
        } else if (child.props.path === '*') {
          fullPath = '*';
        } else {
          const childPath = (child.props.path || '').replace(/^\/+/, '');
          fullPath = parentPath ? `${parentPath}/${childPath}` : `/${childPath}`;
        }

        const { match, params } = matchPath(fullPath, pathname);
        if (match) {
          return (
            <RouteParamsContext.Provider value={params}>
              <OutletContext.Provider value={child.props.element}>
                {route.props.element}
              </OutletContext.Provider>
            </RouteParamsContext.Provider>
          );
        }
      }
    } else if (route.props.path) {
      const { match, params } = matchPath(route.props.path, pathname);
      if (match) {
        return (
          <RouteParamsContext.Provider value={params}>
            {route.props.element}
          </RouteParamsContext.Provider>
        );
      }
    }
  }

  return null;
}

export function Route({ element }) {
  return element || null;
}
