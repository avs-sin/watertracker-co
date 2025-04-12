//
//  WaterTrackerApp.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import TipKit
import SwiftUI
import WidgetKit

@main
struct WaterTrackerApp: App {

    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var manager: DataManager = DataManager(preview: false)
    @Environment(\.scenePhase) var scenePhase

    // MARK: - Main rendering function
    var body: some Scene {
        WindowGroup {
            DashboardContentView()
                .environmentObject(manager)
                .onChange(of: scenePhase) { _, _ in
                    WidgetCenter.shared.reloadAllTimelines()
                    manager.refreshDataIfNeeded()
                }.task {
                    try? Tips.configure([.displayFrequency(.immediate), .datastoreLocation(.applicationDefault)])
                }
        }
    }
}

/// Present an alert from anywhere in the app
func presentAlert(title: String, message: String, primaryAction: UIAlertAction, secondaryAction: UIAlertAction? = nil, tertiaryAction: UIAlertAction? = nil) {
    DispatchQueue.main.async {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(primaryAction)
        if let secondary = secondaryAction { alert.addAction(secondary) }
        if let tertiary = tertiaryAction { alert.addAction(tertiary) }
        rootController?.present(alert, animated: true, completion: nil)
    }
}

extension UIAlertAction {
    static var Cancel: UIAlertAction {
        UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
    }

    static var OK: UIAlertAction {
        UIAlertAction(title: "OK", style: .cancel, handler: nil)
    }
}

var rootController: UIViewController? {
    var root = UIApplication.shared.connectedScenes
        .filter({ $0.activationState == .foregroundActive })
        .first(where: { $0 is UIWindowScene }).flatMap({ $0 as? UIWindowScene })?.windows
        .first(where: { $0.isKeyWindow })?.rootViewController
    while root?.presentedViewController != nil {
        root = root?.presentedViewController
    }
    return root
}

var windowScene: UIWindowScene? {
    let allScenes = UIApplication.shared.connectedScenes
    return allScenes.first { $0.activationState == .foregroundActive } as? UIWindowScene
}

/// Hide keyboard from any view
extension View {
    func hideKeyboard() {
        DispatchQueue.main.async {
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        }
    }
}

/// Check device model
extension UIDevice {
    var modelName: DeviceModel {
        #if targetEnvironment(simulator)
        let identifier = ProcessInfo().environment["SIMULATOR_MODEL_IDENTIFIER"]!
        #else
        var systemInfo = utsname()
        uname(&systemInfo)
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8, value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value)))
        }
        #endif
        switch identifier {
        case "iPhone12,8", "iPhone14,6":                return .iPhoneSE
        default:                                        return .unknown
        }
    }
}

enum DeviceModel: String {
    case unknown
    case iPhoneSE = "iPhone SE"
}

/// Check if the device has a notch (starting with iPhone X)
extension UIDevice {
    var hasNotch: Bool {
        UIDevice.current.modelName != .iPhoneSE
    }
}
