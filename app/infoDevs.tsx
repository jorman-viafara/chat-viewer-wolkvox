"use client"
 
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Building2, Code, MapPin, Calendar, ExternalLink, Briefcase } from "lucide-react"
 
 
interface infoDialog {
    nombreDesarrollador: string
    especialidad: string
    correo: string
    empresa: string
    area: string
    cargo: string
    posicionBoton: string
}
 
export default function ComponentInfoDev({ nombreDesarrollador, especialidad, correo, empresa, area, cargo, posicionBoton }: infoDialog) {
    const [showInfo, setShowInfo] = useState(false)
 
    return (
        <>
            {/* Botón flotante en la esquina inferior izquierda */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className={`fixed top-4 ${posicionBoton} z-50`}
            >
                <motion.div
                    className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/70 text-sm font-medium cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setShowInfo(!showInfo)}
                >
                    {nombreDesarrollador}
                </motion.div>
            </motion.div>
 
            {/* Popup de información del desarrollador */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        className={`fixed top-16 ${posicionBoton} w-96 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 text-white rounded-2xl shadow-2xl z-50 overflow-hidden`}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            duration: 0.3,
                        }}
                    >
                        {/* Header con avatar y nombre */}
                        <div className="relative p-6 pb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                            <div className="relative flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white"> {nombreDesarrollador} </h3>
                                    <p className="text-blue-300 text-sm font-medium"> {especialidad} </p>
                                </div>
                            </div>
                        </div>
 
                        {/* Información de contacto */}
                        <div className="px-6 pb-6 space-y-4">
                            <div className="flex items-center space-x-3 group">
                                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">Correo</p>
                                    <p className="text-white font-medium"> {correo} </p>
                                </div>
                            </div>
 
                            <div className="flex items-center space-x-3 group">
                                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                                    <Building2 className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">Empresa</p>
                                    <p className="text-white font-medium"> {empresa} </p>
                                </div>
                            </div>
 
                            <div className="flex items-center space-x-3 group">
                                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                                    <Code className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">Área</p>
                                    <p className="text-white font-medium"> {area} </p>
                                </div>
                            </div>
 
 
                            <div className="flex items-center space-x-3 group">
                                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                                    <Briefcase className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-xs uppercase tracking-wide font-medium">Cargo</p>
                                    <p className="text-white font-medium"> {cargo} </p>
                                </div>
                            </div>
 
 
                        </div>
 
                        {/* Footer con enlaces */}
                        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-xs">@Todos los derechos reservados</span>
                            </div>
                        </div>
 
                        {/* Indicador de flecha */}
                        <div className="absolute bottom-full left-8 transform translate-y-1/2">
                            <div className="w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-900 border-l border-t border-slate-700/50 rotate-45" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}