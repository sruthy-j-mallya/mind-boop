const RULES = {
  "no-console": ["error", { allow: ["warn", "error"] }],
  // not-auto-fixable: require `return` statements to either always or never specify values.
  "consistent-return": "error",
  // auto-fixable: disallows repeating variable name when declaring object properties.
  "object-shorthand": "error",
  // auto-fixable: Single line statements needn't have any braces. But in all other cases enforce curly braces.
  curly: ["error", "multi-line"],
  // auto-fixable: Remove the else part, if the "if" or "else-if" chain has a return statement
  "no-else-return": "error",
  "comma-dangle": [
    "error",
    {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "never",
    },
  ],
  // auto-fixable: If a variable is never reassigned, using the const declaration is better.
  "prefer-const": "error",
  // auto-fixable: It is considered good practice to use the type-safe equality operators === and !==.
  eqeqeq: "error",
  // not-auto-fixable: Remove redundant async-awaits
  "no-return-await": "warn",
  // not-auto-fixable: Enforces declaring default params last
  "default-param-last": "error",
  // not-auto-fixable: Rule flags optional chaining expressions in positions where short-circuiting to undefined causes throwing a TypeError afterward.
  "no-unsafe-optional-chaining": "error",
  // auto-fixable: Remove all unused imports.
  "unused-imports/no-unused-imports": "error",
  // auto-fixable-1-level-deep: Using nested ternary operators make the code unreadable. Use if/else or switch with if/else. If it's JSX then move it out into a function or a variable. It's fine to use nestedTernary in JSX when it makes code more readable.
  "no-nested-ternary": "warn",
  // auto-fixable: Enforces no braces where they can be omitted.
  "arrow-body-style": ["error", "as-needed"],
  // auto-fixable: Suggests using template literals instead of string concatenation.
  "prefer-template": "error",
  // auto-fixable: Disallows ternary operators when simpler alternatives exist.
  "no-unneeded-ternary": ["error", { defaultAssignment: false }],
  // not-auto-fixable: Disallow empty block statements
  "no-empty": ["error", { allowEmptyCatch: true }],
  // auto-fixable: Partially fixable. Prefer {x} over {x: x}.
  "object-shorthand": [
    "error",
    "always",
    { avoidQuotes: true, ignoreConstructors: true },
  ],
  // auto-fixable: Partially fixable. Unless there's a need to the this keyword, there's no advantage of using a plain function.
  "prefer-arrow-callback": ["error", { allowUnboundThis: true }],
  // not-auto-fixable: Convert multiple imports from same module into a single import.
  "no-duplicate-imports": ["error", { includeExports: true }],
  // auto-fixable: Partially fixable. In JavaScript, there are a lot of different ways to convert value types. Allow only readable coercions.
  "no-implicit-coercion": ["error", { allow: ["!!"] }],
  // auto-fixable: Require let or const instead of var.
  "no-var": "error",
  // not-auto-fixable: ensure people use async/await promising chaining rather than using "then-catch-finally" statements
  "promise/prefer-await-to-then": "error",
  // auto-fixable: avoid calling "new" on a Promise static method like reject, resolve etc
  "promise/no-new-statics": "error",
  // not-auto-fixable: Prevent missing displayName in a React component definition. Useful when using React extensions in browser and checking for component name.
  "react/display-name": "error",
  // not-auto-fixable: Reports when this.state is accessed within setState.
  "react/no-access-state-in-setstate": "error",
  // not-auto-fixable: Report when a DOM element is using both children and dangerouslySetInnerHTML.
  "react/no-danger-with-children": "warn",
  // not-auto-fixable: Prevent definitions of unused prop types.
  "react/no-unused-prop-types": "error",
  // not-auto-fixable: Report missing key props in iterators/collection literals. Important rule!
  "react/jsx-key": "error",
  // not-auto-fixable: Enforce no duplicate props.
  "react/jsx-no-duplicate-props": "error",
  // not-auto-fixable: Enforce PascalCase for user-defined JSX components.
  "react/jsx-pascal-case": ["error", { allowNamespace: true }],
  // not-auto-fixable: Ensures https://reactjs.org/docs/hooks-rules.html.
  "react-hooks/rules-of-hooks": "error",
  // not-auto-fixable: Ensures https://reactjs.org/docs/hooks-rules.html - Checks effect dependencies.
  "react-hooks/exhaustive-deps": "warn",
  // auto-fixable: A fragment is redundant if it contains only one child, or if it is the child of a html element, and is not a keyed fragment.
  "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
  // auto-fixable: Prefer arrow function expressions for component declaration.
  "react/function-component-definition": [
    "error",
    {
      namedComponents: "arrow-function",
      unnamedComponents: "arrow-function",
    },
  ],
  // auto-fixable: Components without children can be self-closed to avoid unnecessary extra closing tag.
  "react/self-closing-comp": [
    "error",
    {
      component: true,
      html: true,
    },
  ],
  // auto-fixable: Wrapping multiline JSX in parentheses can improve readability and/or convenience.
  "react/jsx-wrap-multilines": [
    "error",
    {
      declaration: "parens-new-line",
      assignment: "parens-new-line",
      return: "parens-new-line",
      arrow: "parens-new-line",
      condition: "parens-new-line",
      logical: "parens-new-line",
      prop: "ignore",
    },
  ],
  // auto-fixable: Omit mentioning the "true" value if it can be implicitly understood in props.
  "react/jsx-boolean-value": "error",
  // auto-fixable: Partially fixable. Make sure the state and setter have symmertic naming.
  "react/hook-use-state": "error",
  // auto-fixable: Shorthand notations should always be at the top and also enforce props alphabetical sorting.
  "react/jsx-sort-props": [
    "error",
    {
      callbacksLast: true,
      shorthandFirst: true,
      multiline: "last",
      reservedFirst: false,
      locale: "auto",
    },
  ],
  // auto-fixable: Disallow unnecessary curly braces in JSX props and/or children.
  "react/jsx-curly-brace-presence": [
    "error",
    {
      props: "never",
      children: "never",
      // JSX prop values that are JSX elements should be enclosed in braces.
      propElementValues: "always",
    },
  ],
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
      warnOnUnassignedImports: true,
      groups: [
        "builtin",
        "external",
        "internal",
        "index",
        "sibling",
        "parent",
        "object",
        "type",
      ],
    },
  ],
  // not-auto-fixable: Prefer a default export if module exports a single name.
  "import/prefer-default-export": "off",
  // not-auto-fixable: Forbid a module from importing a module with a dependency path back to itself.
  "import/no-cycle": ["warn", { maxDepth: 1, ignoreExternal: true }],
  // not-auto-fixable: Prevent unnecessary path segments in import and require statements.
  "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
  // not-auto-fixable: Report any invalid exports, i.e. re-export of the same name.
  "import/export": "error",
  // not-auto-fixable: Forbid the use of mutable exports with var or let.
  "import/no-mutable-exports": "error",
  // not-auto-fixable: Ensure all imports appear before other statements.
  "import/first": "error",
  // not-auto-fixable: Ensure all exports appear after other statements.
  "import/exports-last": "error",
  // auto-fixable: Enforce a newline after import statements.
  "import/newline-after-import": ["error", { count: 1 }],
  // auto-fixable: Remove file extensions for import statements.
  "import/extensions": [
    "error",
    "never",
    {
      ignorePackages: true,
      pattern: { json: "always", ico: "always", yml: "always", svg: "always" },
    },
  ],
  // auto-fixable: Prefer non-relative imports (using aliases) over relative imports
  "import/no-relative-packages": "error",
  "import/no-relative-parent-imports": "error",
};

export default RULES;
