import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client=new ApolloClient({
	uri: import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:5000/graphql"
	: "/graphql",
	cache:new InMemoryCache(),
	credentials:"include",
})
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<GridBackground>
				<ApolloProvider client={client}>
				<App />
				</ApolloProvider>
			</GridBackground>
		</BrowserRouter>
	</React.StrictMode>
);
