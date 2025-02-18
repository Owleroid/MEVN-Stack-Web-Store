const corseConfig = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

export default corseConfig;
