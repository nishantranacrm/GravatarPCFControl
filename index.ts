import {IInputs, IOutputs} from "./generated/ManifestTypes";
import {Md5} from "md5-typescript";

export class Gravatar implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	private _imgElement : HTMLImageElement;
	private _container : HTMLDivElement;
	private _context : ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _textElement : HTMLInputElement;
	private _textElementChanged: EventListenerOrEventListenerObject;

	private _value: string;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; 
	 * It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. 
	 * Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', 
	 * it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, 
	state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._context = context;
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged; 
		this._textElementChanged = this.emailAddressChanged.bind(this);

		this._value = "";
		
		if(context.parameters.sampleProperty == null){
			this._value = "";
		}
		else
		{
			this._value = context.parameters.sampleProperty.raw == null ? "" : context.parameters.sampleProperty.raw;
		}			
	 
		this._textElement = document.createElement("input");
		this._textElement.setAttribute("type","text");		
		this._textElement.addEventListener("change", this._textElementChanged);	
		this._textElement.setAttribute("value",this._value);
		this._textElement.setAttribute("class", "InputText");			
		this._textElement.value = this._value;

		this._textElement.addEventListener("focusin", () => {
			this._textElement.className = "InputTextFocused";
			});
			this._textElement.addEventListener("focusout", () => {
				this._textElement.className = "InputText";
			});	
		
		this._imgElement = document.createElement("img");
		this._imgElement.setAttribute("src","https://secure.gravatar.com/avatar/"+ Md5.init(this._value.toLowerCase()));
		this._imgElement.setAttribute("border","2");
	
	 this._container.appendChild(this._textElement);
	 this._container.appendChild(this._imgElement);

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, 
	 * data-sets, global values such as container height and width, offline status,
	 *  control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; 
	 * It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._textElement.readOnly = context.mode.isControlDisabled;
		
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
		    sampleProperty : this._value
		};
	}

	public emailAddressChanged(evt: Event):void
	{
		this._value = this._textElement.value;
		this._imgElement.setAttribute("src","https://secure.gravatar.com/avatar/"+ Md5.init(this._value.toLowerCase()));
		this._notifyOutputChanged();		
	}


	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary		
		this._textElement.removeEventListener("change", this._textElementChanged);	
	}


}