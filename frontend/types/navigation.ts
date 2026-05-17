export type AppRoute =
  | "/"
  | "/#features"
  | "/#technology"
  | "/#open-source"
  | "/#documentation"
  | "/#how-it-works"
  | "/#capabilities"
  | "/#demo"
  | "/#platform"
  | "/#workflow"
  | "/#security"
  | "/login"
  | "/signup"
  | "/dashboard"
  | "/dashboard#analyze"
  | "/dashboard#downloads"
  | "/dashboard#analysis"
  | "/dashboard#chat"
  | "/dashboard#debug";

export type NavItem = {
  label: string;
  href: AppRoute;
  description?: string;
};
