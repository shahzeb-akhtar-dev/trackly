// @ts-expect-error - Nuxt auto-imports
export default defineAppConfig({
  ui: {
    colors: {
      primary: "primary",
      secondary: "slate",
      success: "green",
      info: "sky",
      warning: "amber",
      error: "red",
      neutral: "slate",
    },
    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "text-white bg-primary hover:bg-primary/75", // Override text color
        },
      ],
    },
  },
});
