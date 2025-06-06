// import type { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from "nodemailer";

// type RequestBody = {
// 	name: string;
// 	email: string;
// 	locationFrom?: string;
// 	locationTo?: string;
// 	cargoDesc?: string;
// 	cargoWeight?: string;
// 	cargoVolume?: string;
// 	incoterms?: string;
// 	transportType?: string;
// 	phone?: string;
// };

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		return res.status(405).json({ error: "Method not allowed" });
// 	}
// 	if (!req.body || !req.body.name || !req.body.email) {
// 		return res.status(400).json({ error: "Missing required fields" });
// 	}
// 	const {
// 		name,
// 		email,
// 		locationFrom,
// 		locationTo,
// 		cargoDesc,
// 		cargoWeight,
// 		cargoVolume,
// 		incoterms,
// 		transportType,
// 		phone,
// 	} = req.body as RequestBody;
// 	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
// 		return res.status(400).json({ error: "Invalid email format" });
// 	}

// 	const fields: { label: string; value: string | undefined }[] = [
// 		{ label: "Имя", value: name },
// 		{ label: "Email", value: email },
// 		{ label: "Телефон", value: phone },
// 		{ label: "Местонахождение груза", value: locationFrom },
// 		{ label: "Место доставки груза", value: locationTo },
// 		{ label: "Краткое описание груза", value: cargoDesc },
// 		{ label: "Общий вес груза", value: cargoWeight },
// 		{ label: "Общий объём груза", value: cargoVolume },
// 		{ label: "Инкотермс", value: incoterms },
// 		{ label: "Основной вид перевозки", value: transportType },
// 	];

// 	const textBody = fields
// 		.filter((f) => f.value && f.value.trim() !== "")
// 		.map((f) => `${f.label}: ${f.value}`)
// 		.join("\n");

// 	const htmlBody = fields
// 		.filter((f) => f.value && f.value.trim() !== "")
// 		.map((f) => `<p><strong>${f.label}:</strong> ${f.value}</p>`)
// 		.join("");

// 	try {
// 		const transporter = nodemailer.createTransport({
// 			host: process.env.SMTP_HOST || "smtp.gmail.com",
// 			port: parseInt(process.env.SMTP_PORT || "465"),
// 			secure: true,
// 			auth: {
// 				user: process.env.SMTP_USER,
// 				pass: process.env.SMTP_PASSWORD,
// 			},
// 		});

// 		const mailOptions = {
// 			from: `"Заявка с сайта" <${process.env.SMTP_USER}>`,
// 			to: process.env.SMTP_TO,
// 			subject: "Новая заявка с сайта",
// 			text: textBody,
// 			html: `<h2>Новая заявка с сайта</h2>${htmlBody}`,
// 		};

// 		await transporter.sendMail(mailOptions);
// 		return res.status(200).json({ message: "Заявка успешно отправлена." });
// 	} catch (error) {
// 		console.error("Email sending error:", error);
// 		return res.status(500).json({
// 			error: "Ошибка при отправке заявки",
// 			details: error instanceof Error ? error.message : undefined,
// 		});
// 	}
// }
