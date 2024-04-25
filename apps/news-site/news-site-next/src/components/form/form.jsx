import classNames from "classnames";

import Input from "../input/input";
import { useDataContext } from "@/context/data-context";

import formStyles from "news-site-css/dist/form.module.css";
import buttonStyles from "news-site-css/dist/button.module.css";

export default function Form({ onCancel, onSubmit }) {
    const { forms } = useDataContext();

    function handleSubmit(e) {
        onSubmit(e);
        e.preventDefault();
    }

    function handleChange(e) {
        console.log(e.target.value);
    }

    return (
        <div className={formStyles["form-container"]}>
            <div className={formStyles["form-content"]}>
                <form id="form" onSubmit={handleSubmit}>
                    <Input id="username" placeholder={forms.login.items.username.placeholder} label={forms.login.items.username.label} type={forms.login.items.username.type} containerClass={formStyles["form-item"]} onChange={handleChange} />
                    <Input id="password" placeholder={forms.login.items.password.placeholder} label={forms.login.items.password.label} type={forms.login.items.password.type} containerClass={formStyles["form-item"]} onChange={handleChange} />
                    <div className={classNames(formStyles["form-actions"], formStyles["form-item"])}>
                        <Input id="submit" placeholder={forms.login.submit.placeholder} label={forms.login.submit.label} type={forms.login.submit.type} containerClass={formStyles["form-actions-item"]} onChange={handleSubmit} />
                        <button id="form-reject-button" className={classNames(buttonStyles.button, buttonStyles["secondary-button"], buttonStyles.dark, formStyles["form-actions-item"])} onClick={onCancel}>
                            {forms.login.cancel.label}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
