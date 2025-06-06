import fs from "fs";
import path from "path";
import { GetStaticProps } from "next";

type Props = { html: string };

export default function IndexPage({ html }: Props) {
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const filePath = path.join(process.cwd(), "public", "index.html");
	const html = fs.readFileSync(filePath, "utf8");
	return { props: { html } };
};
