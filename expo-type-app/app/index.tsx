import { Redirect, Href } from 'expo-router';

export default function Index() {
	// Explicitly cast the href as Href to resolve the type issue
	return <Redirect href={"/login" as Href} />;
}
