
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'psm',
    values: [
      {
        name: 'white',
        value: '#FFFFFF',
      },
      {
        name: 'psm',
        value: 'transparent radial-gradient(closest-side at 50% 50%, #1C3138 0%, #151F2D 100%) 0% 0% no-repeat padding-box;',
      },
    ],
  },
}
